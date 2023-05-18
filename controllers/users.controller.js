import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import UserModel from '../models/user.model.js';
import SubscribeModel from '../models/subscribe.model.js';
import ChannelModel from '../models/channel.model.js';
import MessageModel from '../models/message.model.js';

async function register(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false });
  }

  const hashedPassword = await hashPassword(password);

  try {
    await UserModel.createUser(username, hashedPassword);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ success: false, error: 'Username already exists!' });
    }

    return next(err);
  }

  res.json({ success: true });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false });
  }

  const user = await UserModel.getUserByUsername(username);

  if (user && await comparePassword(password, user.password)) {
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET || 'a1b1c1', { expiresIn: '1h' });

    res.cookie('token', token);

    res.json({ success: true, token });
  } else {
    res.json({ success: false, message: 'Incorrect username or password' });
  }
}

function logout(req, res) {
  res.clearCookie('token');

  res.json({ success: true, message: 'You are now logged out' });
}

async function status(req, res) {
  const user = await UserModel.getUserById(req.userId);

  res.json({ success: true, userId: req.userId, username: user.username });
}

async function subscribe(req, res) {
  const { channelName } = req.params;

  const channelId = await ChannelModel.getChannelIdByName(channelName);

  if (!channelId) {
    return res.json({ success: false, error: 'Channel not found!' });
  }

  try {
    await SubscribeModel.subscribeToChannel(req.userId, channelId);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.json({ success: false, error: 'You are already subscribed to this channel!' });
    }

    throw err;
  }

  res.json({ success: true, message: `You have been subscribed to ${channelName}` });
}

async function getMessages(req, res) {
  const { sort } = req.query;

  if (sort !== 'oldest' && sort !== 'newest') {
    return res.json({ success: false, error: 'Invalid sort parameter!' });
  }

  const order = sort === 'oldest' ? 'ASC' : 'DESC';

  const messages = await MessageModel.getAllUserMessages(req.userId, order);

  res.json({ success: true, messages });
}

async function getSubscriptions(req, res) {
  const channels = await UserModel.getSubscribedChannels(req.userId);

  const channelNames = [];
  for (const channel of channels) {
    const channelName = await ChannelModel.getChannelNameById(channel.channelId);

    channelNames.push(channelName);
  }

  res.json({
    success: true,
    message: channelNames.length > 0 ? 'You are subscribed to the following channel(s)' : 'You are not subscribed to any channels yet',
    channels: channelNames.length > 0 ? channelNames : undefined,
  });
}

export default {
  register,
  login,
  logout,
  status,
  subscribe,
  getMessages,
  getSubscriptions,
};
