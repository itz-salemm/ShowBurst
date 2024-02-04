const videoProcessor = require("../middlewares/videoProcessor.js");

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Readable } = require("stream");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION_NAME,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

let key = ""; // Changed key to let to allow reassignment
//let key = "firstVideo.mp4";
let subtileBucketName = "";

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
  console.log(subtileBucketName);
  console.log(key);
  res.render("movies", {});
};

const videoPlayerController = async (req, res) => {
  res.render("player", {});
};

const getSubtitle = async (req, res) => {
  try {
    const subtitleParams = {
      Bucket: bucketName,
      Key: subtileBucketName, // Replace 'your-subtitle-key' with the actual key of your subtitle file
    };

    const subtitleData = await s3Client.send(
      new GetObjectCommand(subtitleParams)
    );

    res.writeHead(200, {
      "Content-Length": subtitleData.ContentLength,
      "Content-Type": subtitleData.ContentType,
    });

    const subtitleStream = Readable.from(subtitleData.Body);
    subtitleStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting subtitle data from S3");
  }
};

module.exports = {
  videoProcessorController,
  getVideoIdController,
  getVideoIdControllerPost,
  videoPlayerController,
  getSubtitle,
};
