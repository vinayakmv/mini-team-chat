const Channel = require("../models/Channel");

exports.getChannels = async (req, res) => {
  const channels = await Channel.find();
  res.json(channels);
};

exports.createChannel = async (req, res) => {
  const channel = await Channel.create({
    name: req.body.name,
    members: [req.user]
  });
  res.json(channel);
};
