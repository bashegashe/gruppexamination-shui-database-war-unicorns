import express from 'express';

import useTry from '../utils/useTry.js';
import ChannelModel from '../models/channel.js';
import MessageModel from '../models/message.js';
import checkAuth from '../middleware/checkAuth.js';
import { subscribeToChannel } from '../models/subscribe.js';
import uuid from 'uuid-random';

const router = express.Router();

router.use(checkAuth);

// Create new channel and subscribe to it
router.post('/', useTry(async (req, res) => {
  const { channelName } = req.body;

  if (!channelName) {
    return res.json({ success: false, error: 'Channel name is required!' });
  }

  const channel = await ChannelModel.createChannel(req.userId, channelName);
  await subscribeToChannel(req.userId, channel.channelId);

  res.json({
    success: true,
    channelId: channel.channelId,
    channelName: channel.channelName,
    message: "You have been auto-subscribed to this channel"
  });
}));

// Post message to a channel
router.post('/messages', useTry(async (req, res) => {
  const { channelNames, message } = req.body;

  if (!channelNames || !message) {
    return res.json({ success: false, error: 'Channel name(s) and message are required!' });
  }

  if (!Array.isArray(channelNames)) {
    return res.json({ success: false, error: 'Channel names must be an array!' });
  }

  const uniqueChannelNames = [...new Set(channelNames)];

  const messageId = uuid();

  await MessageModel.createMessage(req.userId, messageId, message);

  for (const channelName of uniqueChannelNames) {
    const channelId = await ChannelModel.getChannelIdByName(channelName);
    const channelExists = await ChannelModel.channelExists(channelId);

    if (!channelExists) {
      return res.json({ success: false, error: `Channel with name ${channelName} does not exist!` });
    }

    await MessageModel.addMessageToChannel(channelId, messageId);
  }

  res.json({ success: true, messageId, message: "Message sent!" });
}));


// Get all messages from a channel
router.get('/:channelName/messages', useTry(async (req, res) => {
  const { channelName } = req.params;

  if (!channelName) {
    return res.json({ success: false, error: 'Channel name is required!' });
  }

  const channelId = await ChannelModel.getChannelIdByName(channelName);
  const channelExists = await ChannelModel.channelExists(channelId);

  if (!channelExists) {
    return res.json({ success: false, error: `Channel with name ${channelName} does not exist!` });
  }

  const messages = await ChannelModel.getMessagesByChannelId(channelId);

  res.json({ success: true, messages });
}));

export default router;
