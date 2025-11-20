// src/controllers/mediacontroller.js

// Make sure you have imported all necessary modules like the S3 client, etc.
// For this example, we'll assume the S3 logic is implemented correctly.

const path = require('path');
const AWS=require('aws-sdk')
require('dotenv').config()


const uploadmedia = async (req, res) => {
    // Multer (which ran before this function) populates req.file
    if (!req.file) {
        // This handles cases where no file was selected or the form field name was wrong
        return res.status(400).send('No file uploaded or file field missing.');
    }

    const file = req.file;
    
    // Check if the body contains essential data (if needed)
    // console.log("Text fields in body:", req.body); 

    // Generate a unique S3 key
     try{
  const filename =`media/${req.user.id}/${Date.now()}${file.originalname}`;
        const url = await uploadToS3(file, filename)
        console.log(url)
        
        if(url.error){
            throw new Error(`${url.error}`)
        }
        res.status(200).json({ succeses: true, fileurl: url ,file:file,userId:req.user.id})
     }
      
    catch (err) {
        res.status(500).json({ succeses: false, error: err.message })
    }
}

        
 async function uploadToS3(file,filename){
    try {
        const s3 = new AWS.S3();
        const bucketName = process.env.S3_BUCKET_NAME
        const fileParams = {
            // 2. Operation Parameters (using the required keywords)
            Bucket: bucketName,           // <--- The name of your S3 container
            Key: filename, // <--- The name/path of the file in S3
            Body: file.buffer,
            ContentType:file.mimetype,
            ACL:'public-read'
        };
      // Use .promise() to convert the upload operation into an awaitable Promise
        const s3response = await s3.upload(fileParams).promise();
        
        console.log("S3 Upload Successful. Response:", s3response);
        
        // Return the public URL (Location) from the S3 response
        return s3response.Location;
    
    }
    catch(error){
        console.log(error)
        return {error:error.message}
    }
 }


module.exports = {
    uploadmedia
};