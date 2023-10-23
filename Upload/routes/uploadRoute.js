const express = require("express");
const router = express.Router();

const { uploadView, uploadPost } = require("../controllers/uploadController");

router.get("/api/upload", uploadView);
router.post("/api/upload", uploadPost);

module.exports = router;
