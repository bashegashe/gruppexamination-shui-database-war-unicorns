import db from '../utils/db.js';

function createMessage(userId, messageId, message) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO messages (messageId, userId, message, sentDate)
      VALUES (?, ?, ?, ?);
    `;

    db.run(sql, [messageId, userId, message, new Date()], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(messageId);
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

    db.run(sql, [channelId, messageId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(messageId);
      }
    });
  });
}

export default {
  createMessage,
  addMessageToChannel,
}