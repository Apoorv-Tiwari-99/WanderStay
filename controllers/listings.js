const Listing=require("../models/listing");
const mapToken=process.env.MAP_TOKEN;
module.exports.index=async(req,res)=>{
    let allListing = await Listing.find();
    res.render("listings/index.ejs",{allListing});
 }

 module.exports.renderNewForm=(req,res)=>{
    res.render("listings/form.ejs");
 }

 module.exports.createListing=async(req,res,next)=>{
  let response=null;
    async function run() {
        const maptilerSdk = await import('@maptiler/sdk');
    
        // Setting API 
        const apiKey = mapToken;  
    
        // Configure the API key in the SDK
        maptilerSdk.config.apiKey = apiKey;

       response= await maptilerSdk.geocoding.forward(req.body.listing.location,{limit:1});
    }

    await run();    

    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Added.");
    res.redirect("/listings");
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{ path:"author",},}).populate("owner");
    if(!listing){
    req.flash("error","Listing Does Not Exits!");
    res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
 }
 module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
   const listing = await Listing.findById(id);
   if(!listing){
     req.flash("error","Listed Does Not Exits!");
     res.redirect("/listings");
   }
   let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    const updatedListing= await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
    }
    await updatedListing.save();
    req.flash("success","Listing Updated.");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    const deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted.");
    res.redirect("/listings");
}

module.exports.filterListing=async(req,res)=>{
    let filter=req.params.filter;
    const filteredListing= await Listing.find({category:filter});
    res.render("listings/filter.ejs",{filteredListing});   
}

module.exports.searchListing=async(req,res)=>{
    const { country, destination } = req.query;
    console.log(country,destination);
    let query = {};
    
    if (country) {
      query.country = { $regex: new RegExp(country, 'i') }; // Case-insensitive search for country
    }

    if (destination) {
      query.location = { $regex: new RegExp(destination, 'i') }; // Case-insensitive search for destination
    }

    // Perform the search based on the query
    const filteredListing = await Listing.find(query);
    res.render("listings/search.ejs",{filteredListing,country,
     destination,});
}