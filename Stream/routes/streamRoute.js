const express = require("express");
const router = express.Router();

const { streamView, stream } = require("../controllers/streamController");

router.get("/video", streamView);
router.get("/", stream);

module.exports = router;
