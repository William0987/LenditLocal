const dotenv = require("dotenv");

dotenv.config(); 
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); 
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const sharp = require("sharp"); 
const AuthModel = require("../models/Auth");

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const uploadImage = async (req, res) => {
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
    console.log("Image uploaded successfully");
    res.send({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading and updating user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getImages = async (req, res) => {};

const deleteImage = async (req, res) => {};

module.exports = { getImages, uploadImage, deleteImage };
