import express from 'express';

import useTry from '../utils/useTry.js';
import ChannelModel from '../models/channel.js';
import MessageModel from '../models/message.js';
import checkAuth from '../middleware/checkAuth.js';
import { subscribeToChannel } from '../models/subscribe.js';
import uuid from 'uuid-random';
import { isSubscribed } from '../models/subscribe.js';
import checkChannel from '../middleware/checkChannel.js';

const router = express.Router();

router.use(checkAuth);

// Create new channel and subscribe to it
router.post('/', useTry(async (req, res) => {
  const { channelName } = req.body;

  if (!channelName) {
    return res.json({ success: false, error: 'Channel name is required!' });
  }

  let channel;
  try {
    channel = await ChannelModel.createChannel(req.userId, channelName);
  } catch (err) {
    return res.json({ success: false, error: "Channel already exists!" });
  }
  await subscribeToChannel(req.userId, channel.channelId);

  res.json({
    success: true,
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

  const channelIds = [];
  for (const channelName of uniqueChannelNames) {
    const channelId = await ChannelModel.getChannelIdByName(channelName);
    const channelExists = await ChannelModel.channelExists(channelId);

    if (!channelExists) {
      return res.json({ success: false, error: `Channel with name ${channelName} does not exist!` });
    }

    const isSubscribedToChannel = await isSubscribed(req.userId, channelId);

    if (!isSubscribedToChannel) {
      return res.json({ success: false, error: `You are not subscribed to channel ${channelName}!` });
    }

    channelIds.push(channelId);
  }

  await MessageModel.createMessage(req.userId, messageId, message);

  for (let i = 0; i < channelIds.length; i++) {
    await MessageModel.addMessageToChannel(channelIds[i], messageId);
  }

  res.json({ success: true, message: "Message posted to channel(s)!" });
}));

// Get all messages from a channel
router.get('/:channelName/messages', checkChannel, useTry(async (req, res) => {
  const { sort } = req.query;

  let order;
  if (sort == 'oldest' || sort == 'newest') {
    order = sort === 'oldest' ? 'ASC' : 'DESC';
  }

  const messages = await ChannelModel.getMessagesByChannelId(req.channelId, order);

  res.json({ success: true, messages });
}));

export default router;

