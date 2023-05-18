import express from 'express';

import useTry from '../utils/useTry.js';
import checkAuth from '../middleware/checkAuth.js';
import UsersController from '../controllers/users.controller.js';

const router = express.Router();

router.post('/register', useTry(UsersController.register));
router.post('/login', useTry(UsersController.login));
router.get('/logout', checkAuth, useTry(UsersController.logout));

// Returns userId and username if user is logged in
router.get('/status', checkAuth, useTry(UsersController.status));

// Subscribe to a channel
router.post('/subscriptions/:channelName', checkAuth, useTry(UsersController.subscribe));

// Gets all messages from all channels user is subscribed to
// Can be sorted by passing sort query parameter with value newest or oldest
router.get('/messages', checkAuth, useTry(UsersController.getMessages));

// Shows channels user is subscribed to
router.get('/subscribed', checkAuth, useTry(UsersController.getSubscriptions));

export default router;
