const express = require("express");
const multer = require("multer"); 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

const {
  getImages,
  uploadImage,
  deleteImage,
} = require("../controllers/images");
const router = express.Router();

router.get("/images", getImages);
router.post("/images", upload.single("image"), uploadImage);
// router.patch("/images/:id", patchImage);
router.delete("/images/:id", deleteImage);

module.exports = router;
