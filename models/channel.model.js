import uuid from 'uuid-random';
import moment from 'moment';
import db from '../utils/db.js';

function createChannel(ownerId, channelName) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO channels (channelId, ownerId, channelName)
      VALUES (?, ?, ?);
    `;

    const channelId = `cid-${uuid()}`;

    db.run(sql, [channelId, ownerId, channelName], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ channelId, channelName });
      }
    });
  });
}

function getChannelIdByName(channelName) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT channelId
      FROM channels
      WHERE channelName = ?;
    `;

    db.get(sql, [channelName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row?.channelId);
      }
    });
  });
}

function getChannelNameById(channelId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT channelName
      FROM channels
      WHERE channelId = ?;
    `;

    db.get(sql, [channelId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row?.channelName);
      }
    });
  });
}

// Check if channel exists
function channelExists(channelId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT channelId
      FROM channels
      WHERE channelId = ?;
    `;
    db.get(sql, [channelId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row?.channelId);
      }
    });
  });
}

function getMessagesByChannelId(channelId, order) {
  if (!order) order = 'ASC';

  return new Promise((resolve, reject) => {
    const sql = `
      SELECT users.username, messages.message, messages.sentDate
      FROM messages
      JOIN message_channels ON messages.messageId = message_channels.messageId
      JOIN users ON messages.userId = users.userId
      WHERE message_channels.channelId = ?
      ORDER BY messages.sentDate ${order};
    `;

    db.all(sql, [channelId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length > 0) {
          rows.forEach((row) => {
            row.sentDate = moment(row.sentDate).format('YY/MM/DD HH:mm:ss');
          });
        }

        resolve(rows);
      }
    });
  });
}

export default {
  createChannel,
  getChannelIdByName,
  channelExists,
  getMessagesByChannelId,
  getChannelNameById,
};
