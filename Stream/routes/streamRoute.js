const express = require("express");
const router = express.Router();

const {
  streamView,
  stream,
  getMovie,
  streamViewPost,
} = require("../controllers/streamController");

router.get("/video", streamView);
router.post("/video", streamViewPost);
router.get("/", stream);
router.get("/post", getMovie);

module.exports = router;
