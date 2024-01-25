const express = require("express");
const router = express.Router();

const {
  videoProcessorController,
  videoPlayerController,
  getVideoIdControllerPost,
  getVideoIdController,
} = require("../controllers/streamController");

router.get("/video", videoProcessorController);
router.get("/", videoPlayerController);
router.get("/videos", getVideoIdController);
router.post("/videos", getVideoIdControllerPost);

module.exports = router;
