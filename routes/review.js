const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync=require("../utiles/wrapAsync.js");
const ExpressError=require('../utiles/expressError.js');
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

// Reviews Post Route 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


// Review Delete Route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;