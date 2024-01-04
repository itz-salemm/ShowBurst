const formidable = require("formidable");

const parsefile = async (req) => {
  return new Promise((resolve, reject) => {
    let options = {
      maxFileSize: 1000 * 1024 * 1024, // 100 MBs converted to bytes,
      allowEmptyFiles: false,
    };

    const form = new formidable.IncomingForm(options);

    // Handle file uploads
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        // Successfully parsed form data and files
        resolve({ fields, files });
      }
    });
  });
};

module.exports = parsefile;
