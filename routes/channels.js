import express from 'express';

import useTry from '../utils/useTry.js';
// import ChannelModel from '../models/channel.js';
// import MessageModel from '../models/message.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.use(checkAuth);

// Create new channel
router.post('/', useTry(async (req, res) => {

}));

// Get all messages from a channel
router.get('/:channelId/messages', useTry(async (req, res) => {

}));

// Post message to a channel
router.post('/:channelId/messages', useTry(async (req, res) => {

}));

export default router;
