const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");

router.get("/:channelId", auth, messageController.getMessages);

module.exports = router;
