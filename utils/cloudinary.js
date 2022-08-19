const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_SECRET_KEY
});

const cloudinaryUploadImg = async(fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: "auto",
        });
        return data;
    } catch (error) {
       return error; 
    }  
}

module.exports = cloudinaryUploadImg;