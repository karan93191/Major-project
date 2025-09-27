const Listing=require("../models/listing")
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_KEY;

require("dotenv").config();



module.exports.index=async (req,res)=>{
      const allListings= await Listing.find()
      res.render("listings/index.ejs",{allListings})
    }
module.exports.renderNewform=(req,res)=>{
      res.render("listings/new.ejs")
    }
    module.exports.showlistings=async(req,res)=>{
          let {id}=req.params;
          // console.log(req.params)
          const listing=await Listing.findById(id).populate({
            path: "reviews",
            populate: {
              path: "author",
            },
          })
          .populate("owner");
          if(!listing){
            req.flash("error","listing does not exist")
           return res.redirect("/listings")
          }
          res.render("listings/show.ejs",{listing})
        }
module.exports.createlisting=async(req,res,next)=>{
    
    // Geocode user query
    const response = await maptilerClient.geocoding.forward(req.body.listing.location, {
  limit: 1,
});


    
     let url=req.file.path
     let filename=req.file.filename
     
        // let {title,image,description,price,location,country}=req.body
      const newList=new Listing(req.body.listing)
      newList.owner=req.user._id
      newList.image={url,filename}
       newList.geometry=response.features[0].geometry
   let savedlist= await  newList.save();
  //  console.log(savedlist)
     req.flash("success","List created succesfully!")
      res.redirect("/listings")
    }
    module.exports.searchListing=async(req,res)=>{
     const { location } = req.query;

const listing = await Listing.find({
  location: { $regex: new RegExp("^" + location + "$", "i") }
});
if(listing.length==0){
  req.flash("error","no place with this city")
  return res.redirect("/listings")
}
     res.render("listings/search.ejs",{listing})
    }
  module.exports.renderEditform=async (req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id)
        if(!listing){
          req.flash("error","listing does not exist")
         return res.redirect("/listings")
        }
        let originalImageUrl=listing.image.url;
       originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250")
        res.render("listings/edit.ejs",{listing,originalImageUrl})
      }
    module.exports.updatelitsing=async(req,res)=>{
          let {id}=req.params;
          // let {title,image,description,price,location,country}=req.body
         let listing= await Listing.findByIdAndUpdate(id,req.body.listing)
         if(typeof req.file !=="undefined"){
           let url=req.file.path
       let filename=req.file.filename
         listing.image={url,filename}
         await listing.save()
         }
          // req.flash("success","List updated succesfully!")
          res.redirect("/listings")
        }

    module.exports.destroylisting=async (req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndDelete(id)
      
      res.redirect("/listings")
    }