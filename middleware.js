const Listing=require("./models/listing.js")
  const Review=require("./models/review.js")
module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirecturl=req.originalUrl;
        req.flash("error","you are not logged in")
        return res.redirect("/login")
      }
      
      next();
}
module.exports.saveredirecturl=(req,res,next)=>{
  if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl
      }
      next();
}
module.exports.isOwner=async(req,res,next)=>{
   let {id}=req.params;
      let listing=await Listing.findById(id)
      if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
      }
      next();
}
module.exports.isAuthor=async(req,res,next)=>{
   let {id,reviewId}=req.params;
      let listing=await Review.findById(reviewId)
      if(!listing.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this listing")
        return res.redirect(`/listings/${id}`)
      }
      next();
}