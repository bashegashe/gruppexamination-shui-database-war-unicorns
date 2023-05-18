import db from '../utils/db.js';

function subscribeToChannel(userId, channelId) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO user_channels (userId, channelId)
      VALUES (?, ?);
    `;

    db.run(sql, [userId, channelId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(channelId);
      }
    });
  });
}

function isSubscribed(userId, channelId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT channelId
      FROM user_channels
      WHERE userId = ? AND channelId = ?;
    `;

    db.get(sql, [userId, channelId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row?.channelId);
      }
    });
  });
}

export default {
  subscribeToChannel,
  isSubscribed,
};
