const express = require("express");
const app = express();

const uploadRouter = require("./routes/uploadRoute");

const port = process.env.PORT || 4003;

app.set("json spaces", 5);

app.use("/", uploadRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
