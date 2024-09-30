const dotenv = require("dotenv");

dotenv.config(); 
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); 
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const sharp = require("sharp"); 
const AuthModel = require("../models/Auth");
const ListingModel = require("../models/Listings2");

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const uploadAvatar = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const buffer = await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: "contain",
      })
      .toBuffer();

    const params = {
      Bucket: bucketName,
      Key: `image-${Date.now()}.jpeg`, 
      Body: buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read", 
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const user = await AuthModel.findById(user_id);
    user.image_url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${params.Key}`;
    await user.save();
    console.log("User image uploaded successfully");
    res.send({
      message: "Image uploaded successfully",
      url: user.image_url,
    });
  } catch (error) {
    console.error("Error uploading and updating user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const uploadListingImage = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: "contain",
      })
      .toBuffer();

    const params = {
      Bucket: bucketName,
      Key: `image-${Date.now()}.jpeg`, 
      Body: buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read", 
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("Listing image uploaded successfully");

    const image_url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${params.Key}`;

    if ("listing_id" in req.body) {
      const listing_id = req.body.listing_id;
      const listing = await ListingModel.findById(listing_id);
      listing.image_url = image_url;
      await listing.save();
      console.log("Listing image stored in db");
    }

    res.send({
      message: "Image uploaded successfully",
      url: image_url,
    });
  } catch (error) {
    console.error("Error uploading and updating listing:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { uploadAvatar, uploadListingImage };
