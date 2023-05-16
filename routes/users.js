import express from 'express';
import jwt from 'jsonwebtoken';

import useTry from '../utils/useTry.js';
import UserModel from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/register', useTry(async (req, res, next) => {
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
}));

router.post('/login', useTry(async (req, res) => {
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
    res.json({ success: false, message: "Incorrect username or password" });
  }
}));

router.get('/logout', checkAuth, (req, res) => {
  res.clearCookie('token');

  res.json({ success: true });
});

// Subscribe to a channel
router.post('/:userId/subscriptions/:channelId', checkAuth, useTry(async (req, res) => {

}));

export default router;
