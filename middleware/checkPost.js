import uuid from 'uuid-random';
import ChannelModel from '../models/channel.model.js';
import SubscribeModel from '../models/subscribe.model.js';

async function checkPost(req, res, next) {
  const { channelNames, message } = req.body;

  if (!channelNames || !message) {
    return res.json({ success: false, error: 'Channel name(s) and message are required!' });
  }

  if (!Array.isArray(channelNames)) {
    return res.json({ success: false, error: 'Channel names must be an array!' });
  }

  const uniqueChannelNames = [...new Set(channelNames)];

  const messageId = `mid-${uuid()}`;

  const channelIds = [];
  for (const channelName of uniqueChannelNames) {
    const channelId = await ChannelModel.getChannelIdByName(channelName);
    const channelExists = await ChannelModel.channelExists(channelId);

    if (!channelExists) {
      return res.json({ success: false, error: `Channel with name ${channelName} does not exist!` });
    }

    const isSubscribedToChannel = await SubscribeModel.isSubscribed(req.userId, channelId);

    if (!isSubscribedToChannel) {
      return res.json({ success: false, error: `You are not subscribed to channel ${channelName}!` });
    }

    channelIds.push(channelId);
  }

  req.messageId = messageId;
  req.message = message;
  req.channelIds = channelIds;

  next();
}

export default checkPost;
