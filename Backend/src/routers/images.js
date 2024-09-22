const express = require("express");
const multer = require("multer"); 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

const { uploadAvatar, uploadListingImage } = require("../controllers/images");
const router = express.Router();

router.post("/images/avatars", upload.single("image"), uploadAvatar);
router.post("/images/listings", upload.single("image"), uploadListingImage);

module.exports = router;
