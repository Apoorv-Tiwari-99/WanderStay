const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    // Here keys name are same everytime we use 
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WanderStay_DEV',
      allowedFormats:["png","jpg","jpeg"], // supports promises as well
    },
  });

  module.exports={cloudinary,storage};