const express = require("express");
const multer = require("multer"); 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

const { uploadImage } = require("../controllers/images");
const router = express.Router();

router.post("/images/avatars", upload.single("image"), uploadImage);
// router.get("/images", getImages);
// router.patch("/images/:id", patchImage);
// router.delete("/images/:id", deleteImage);

module.exports = router;
