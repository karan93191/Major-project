const moongose=require("mongoose");
const review = require("./review");
const { required } = require("joi");
const Schema=moongose.Schema

const listingSchema=new Schema({
    title:{
    type:String,
    required:true
    },
    description:String,
    price:Number,
    
    image:{
        url:String,
        filename:String,
    },
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
         type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true
    },  
},
    category:{
        type:String,
        enum:["Trending","Rooms","Iconic cities","Mountain","Castle","Amazing pools","Farms","Arctic","Boats","Domes"],
        required:true,
    }
}
)
listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing){
         await review.deleteMany({_id:{$in:listing.reviews}})    
    }

})
const Listing=moongose.model("listing",listingSchema)
module.exports=Listing;
