import db from '../utils/db.js';

function createUser(username, password) {
  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO users (username, password)
    VALUES (?, ?);
    `;

    db.run(sql, [username, password], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT userId, username, password
    FROM users
    WHERE username = ?;
    `;

    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export default {
  createUser,
  getUserByUsername,
};