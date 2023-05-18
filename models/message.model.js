import moment from 'moment';
import db from '../utils/db.js';

function createMessage(userId, messageId, message) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO messages (messageId, userId, message, sentDate)
      VALUES (?, ?, ?, ?);
    `;

    db.run(sql, [messageId, userId, message, new Date()], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function addMessageToChannel(channelId, messageId) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO message_channels (channelId, messageId)
      VALUES (?, ?);
    `;

    db.run(sql, [channelId, messageId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(messageId);
      }
    });
  });
}

function getAllUserMessages(userId, order) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT message, sentDate
      FROM messages
      WHERE userId = ?
      ORDER BY sentDate ${order};
    `;

    db.all(sql, [userId], (err, rows) => {
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
  createMessage,
  addMessageToChannel,
  getAllUserMessages,
};
