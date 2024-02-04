const express = require("express");
const router = express.Router();

const {
  videoProcessorController,
  videoPlayerController,
  getVideoIdControllerPost,
  getVideoIdController,
  getSubtitle,
} = require("../controllers/streamController");

router.get("/video", videoProcessorController);
router.get("/", videoPlayerController);
router.get("/videos", getVideoIdController);
router.post("/videos", getVideoIdControllerPost);
router.get("/subtitle", getSubtitle);

module.exports = router;
