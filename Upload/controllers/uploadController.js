const fileparser = require("../middlewares/fileParser");

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
  await fileparser(req)
    .then((data) => {
      res.status(200).json({
        message: "Success",
        data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "An error occurred.",
        error,
      });
      console.error(error);
    });
};

module.exports = {
  uploadView,
  uploadPost,
};
