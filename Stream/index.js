const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const streamRouter = require("./routes/streamRoute");

// Middleware to parse JSON data
app.use(bodyParser.json());

app.set("json spaces", 5);

app.set("view engine", "ejs");

app.use("/", streamRouter);
app.use("/post", streamRouter);

app.listen(8000, () => {
  console.log("Listening on port 8000!");
});
