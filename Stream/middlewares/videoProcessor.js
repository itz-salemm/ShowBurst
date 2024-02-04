const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { Readable } = require("stream");
require("dotenv").config();

const https = require("https");
// Increase the default listener limit for TLSSocket instances
https.Agent.defaultMaxSockets = 15; // or any number you deem appropriate
// Set the max listeners to accommodate the limit
https.Agent.setMaxListeners(15); // or the number you set above

// Create S3 client with credentials and region
const s3Client = new S3Client({
  region: process.env.AWS_REGION_NAME,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

const videoProcessor = async (range, key, res, subtileBucketName) => {
  try {
    const data = await s3Client.send(
      new HeadObjectCommand({ Bucket: bucketName, Key: key })
    );

    const videoSize = data.ContentLength;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // Fetch subtitle data
    const subtitleParams = {
      Bucket: bucketName,
      Key: subtileBucketName,
    };
    const subtitleData = await s3Client.send(
      new GetObjectCommand(subtitleParams)
    );

    // Set headers for subtitle data
    const subtitleHeaders = {
      "Content-Length": subtitleData.ContentLength,
      "Content-Type": subtitleData.ContentType,
    };

    res.writeHead(206, headers);

    const params = {
      Bucket: bucketName,
      Key: key,
      Range: `bytes=${start}-${end}`,
    };

    const { Body } = await s3Client.send(new GetObjectCommand(params));
    const videoStream = Readable.from(Body); // Convert body to Readable stream
    return videoStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting video information from S3");
  }
};

module.exports = videoProcessor;
