const express = require("express");

const app = express();
const streamRouter = require("./routes/streamRoute");

app.set("json spaces", 5);

app.use("/", streamRouter);

app.listen(8000, () => {
  console.log("Listening on port 8000!");
});
