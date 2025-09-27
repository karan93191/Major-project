const express=require("express")
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Review=require("../models/review")
const Listing=require("../models/listing.js")
const {isloggedin,isAuthor}=require("../middleware.js")
const reviewController=require("../controller/review.js")
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// create review
router.post("/listings/:id/reviews",isloggedin,validateReview,wrapAsync(reviewController.createReview))
// delete review
router.delete("/listings/:id/reviews/:reviewId",isloggedin,isAuthor,wrapAsync(reviewController.destroyReview))
module.exports=router