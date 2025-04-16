import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return console.error("File Path Not Found");
    // Upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log(response);
    // File has been Uploaded Successfully
    // console.log("File has been Uploaded on Cloudinary", response.url);

    fs.unlinkSync(localFilePath); // Reove file from our applications local storage when operation got failed
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Reove file from our applications local storage when operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
