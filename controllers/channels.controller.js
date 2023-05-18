import MessageModel from '../models/message.model.js';
import ChannelModel from '../models/channel.model.js';
import SubscribeModel from '../models/subscribe.model.js';

async function createChannel(req, res) {
  const { channelName } = req.body;

  if (!channelName) {
    return res.json({ success: false, error: 'Channel name is required!' });
  }

  let channel;
  try {
    channel = await ChannelModel.createChannel(req.userId, channelName);
  } catch (err) {
    return res.json({ success: false, error: 'Channel already exists!' });
  }
  await SubscribeModel.subscribeToChannel(req.userId, channel.channelId);

  res.json({
    success: true,
    channelName: channel.channelName,
    message: 'You have been auto-subscribed to this channel',
  });
}

async function postMessage(req, res) {
  await MessageModel.createMessage(req.userId, req.messageId, req.message);

  for (let i = 0; i < req.channelIds.length; i++) {
    await MessageModel.addMessageToChannel(req.channelIds[i], req.messageId);
  }

  res.json({ success: true, message: 'Message posted to channel(s)!' });
}

async function getMessages(req, res) {
  const { sort } = req.query;

  let order;
  if (sort === 'oldest' || sort === 'newest') {
    order = sort === 'oldest' ? 'ASC' : 'DESC';
  }

  const messages = await ChannelModel.getMessagesByChannelId(req.channelId, order);

  res.json({
    success: true,
    message: messages.length > 0 ? undefined : 'No messages found!',
    messages: messages.length > 0 ? messages : undefined,
  });
}

export default {
  createChannel,
  postMessage,
  getMessages,
};
