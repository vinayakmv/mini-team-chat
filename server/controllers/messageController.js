const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { channelId } = req.params;

  const messages = await Message.find({ channel: channelId })
    .populate("sender", "name email")
    .sort({ createdAt: -1 })
    .limit(30);

  res.json(messages.reverse());
};
