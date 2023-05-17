import ChannelModel from '../models/channel.js';

async function checkChannel(req, res, next) {
  const { channelName } = req.params;

  if (!channelName) {
    return res.json({ success: false, error: 'Channel name is required!' });
  }

  const channelId = await ChannelModel.getChannelIdByName(channelName);
  const exists = await ChannelModel.channelExists(channelId);

  if (!exists) {
    return res.json({ success: false, error: `Channel with name ${channelName} does not exist!` });
  }

  req.channelId = channelId;

  next();
}

export default checkChannel;