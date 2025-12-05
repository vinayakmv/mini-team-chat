const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const auth = require("../middleware/auth");

router.get("/", auth, channelController.getChannels);
router.post("/", auth, channelController.createChannel);

module.exports = router;
