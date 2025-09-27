const express=require("express")
const router=express.Router()
const Listing=require("../models/listing.js")
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const {isloggedin,isOwner}=require("../middleware.js")
const listingController=require("../controller/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage })
// const upload = multer({ dest 'uploads/' })


const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

  // index route and craete route
router.route("/listings")
.get((listingController.index))
.post(isloggedin,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createlisting))
// .post(upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file)
// })
  
    // new route
    router.get("/listings/new",isloggedin,(listingController.renderNewform))
    router.get("/listings/search",(listingController.searchListing))
    
    // show route and delete route and update route
    router.route("/listings/:id")
    .get(wrapAsync(listingController.showlistings))
    .put(isloggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updatelitsing))
    .delete(isloggedin,isOwner,wrapAsync(listingController.destroylisting))

    // edit route
    router.get("/listings/:id/edit",isloggedin,isOwner,wrapAsync (listingController.renderEditform))

    // category route
    router.get("/listings/category/:cat",listingController.listingCategory);
    
    module.exports=router