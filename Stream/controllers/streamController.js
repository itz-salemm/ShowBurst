const videoProcessor = require("../middlewares/videoProcessor.js");

let key = "";
let subtileBucketName = ""; // Changed key to let to allow reassignment
//let key = "firstVideo.mp4";

const videoProcessorController = async (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires range header");
    return;
  }

  videoProcessor(range, key, res, subtileBucketName);
};

const getVideoIdController = async (req, res) => {
  res.render("movies", {});
};

const getVideoIdControllerPost = async (req, res) => {
  key = req.body.id;
  subtileBucketName = req.body.subtileBucketName;
  console.log(key);
  res.render("movies", {});
};

const videoPlayerController = async (req, res) => {
  res.render("player", {});
};

module.exports = {
  videoProcessorController,
  getVideoIdController,
  getVideoIdControllerPost,
  videoPlayerController,
};
