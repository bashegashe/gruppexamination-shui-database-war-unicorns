import express from 'express';

import useTry from '../utils/useTry.js';
import checkAuth from '../middleware/checkAuth.js';
import checkChannel from '../middleware/checkChannel.js';
import ChannelsController from '../controllers/channels.controller.js';
import checkPost from '../middleware/checkPost.js';

const router = express.Router();

router.use(checkAuth);

// Create new channel and subscribe to it
router.post('/', useTry(ChannelsController.createChannel));

// Post message to a channel
router.post('/messages', checkPost, useTry(ChannelsController.postMessage));

// Get all messages from a channel
router.get('/:channelName/messages', checkChannel, useTry(ChannelsController.getMessages));

export default router;
