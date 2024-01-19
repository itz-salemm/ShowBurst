const express = require("express");
const fs = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_NAME,
});

const app = express();

const bucketName = process.env.AWS_BUCKET_NAME;
const key = "firstVideo.mp4";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires range header");
  }

  //const videoPath = "s3://${bucketName}/${key}";
  s3.headObject({ Bucket: bucketName, Key: key }, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error getting video information from S3");
      return;
    }

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

    res.writeHead(206, headers);

    const params = {
      Bucket: bucketName,
      Key: key,
      Range: `bytes=${start}-${end}`,
    };

    const videoStream = s3.getObject(params).createReadStream();
    videoStream.pipe(res);
  });
});

app.listen(8000, () => {
  console.log("Listening on port 8000!");
});
