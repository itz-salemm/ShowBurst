const AWS = require("aws-sdk");

require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_NAME,
});

const bucketName = process.env.AWS_BUCKET_NAME;
const key = "firstVideo.mp4";

const streamView = async (req, res) => {
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
};

const stream = async (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Video Streaming With Node</title>
      <style>
        body {
          margin: 5% auto;
          max-width: 100%;
          background-color: rgb(14, 14, 14);
          padding-top: 10%;
          padding-left: 35%;
        }
      </style>
    </head>
    <body>
      <video id="videoPlayer" width="50%" controls muted="muted" autoplay>
        <source src="/video" type="video/mp4" />
      </video>
    </body>
  </html>`);
};

module.exports = {
  streamView,
  stream,
};
