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
    // image:{
    //     type:String,
    //     default:
    //         "https://images.unsplash.com/photo-1663790682196-926e224c50a7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set:(v)=>
    //         v===""? "https://images.unsplash.com/photo-1663790682196-926e224c50a7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //         : v,
    // },
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
      enum: ['Point'], // 'location.type' must be 'Point'
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