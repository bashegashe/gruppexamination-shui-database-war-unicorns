import db from '../utils/db.js';

function subscribeToChannel(userId, channelId) {
  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO user_channels (userId, channelId)
    VALUES (?, ?);
    `;

    db.run(sql, [userId, channelId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(channelId);
      }
    });
  });
}

export {
  subscribeToChannel,
};