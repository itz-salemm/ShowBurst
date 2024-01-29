const videoProcessor = require("../middlewares/videoProcessor.js");

let key = ""; // Changed key to let to allow reassignment
//let key = "firstVideo.mp4";

const videoProcessorController = async (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires range header");
    return;
  }

  videoProcessor(range, key, res);
};

const getVideoIdController = async (req, res) => {
  res.render("movies", {});
};

const getVideoIdControllerPost = async (req, res) => {
  console.log(req.body.id);
  key = req.body.id;
  res.redirect(302, "player");
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
