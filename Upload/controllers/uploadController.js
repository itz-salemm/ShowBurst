const fileparser = require("../middlewares/fileParser");
const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_NAME,
});

const uploadView = (req, res) => {
  res.send(`
    <h2>Upload video to ShowBurst</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Select a file:
        <input type="file" name="file" multiple="multiple" />
      </div>
      <input type="submit" value="Upload" />
    </form>

  `);
};

const uploadPost = async (req, res) => {
  try {
    const data = await fileparser(req);
    res.status(200).json({
      message: "Success",
      data,
    });
    const file = data.files.file[0].filepath;
    const fileName = data.files.file[0].originalFilename;
    const fileContent = await fs.createReadStream(file);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${fileName}`,
      Body: fileContent,
    };
    await s3.upload(params, (err, s3Data) => {
      if (err) {
        console.error("Error uploading file:", err);
      } else {
        console.log(
          "File uploaded successfully. S3 Location:",
          s3Data.Location
        );
      }
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred.",
      error,
    });
    console.error(error);
  }
};

module.exports = {
  uploadView,
  uploadPost,
};
