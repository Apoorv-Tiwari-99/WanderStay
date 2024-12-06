const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const ListingSchema=new Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        //   required: true
        },
        coordinates: {
          type: [Number],
        //   required: true
        }
    },
    category:{
        type:String,
        enum:["Trending","Rooms","Iconic Cities","Mountain","Castles","Amazing Pools","Camping","Farms","Arctic","Boats","Skiing"],
        required:true,
    },
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})


const Listing= mongoose.model("Listing",ListingSchema);
module.exports=Listing;