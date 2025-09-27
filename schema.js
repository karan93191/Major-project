const Joi = require("joi")
const review = require("./models/review");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().allow(""),

    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
     category: Joi.string()
      .valid("Trending","Rooms","Iconic cities","Mountain","Castle","Amazing pools","Farms","Arctic","Boats","Domes")
      .required()
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
  }).required()
});
