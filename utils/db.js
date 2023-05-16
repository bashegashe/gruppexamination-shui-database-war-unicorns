import sqlite3 from 'sqlite3';

sqlite3.verbose();

const DBSOURCE = './databases/shui.sqlite';

function createTable(db) {
  const sql = `
  CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_channels (
    userId INTEGER NOT NULL,
    channelId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
    FOREIGN KEY (channelId) REFERENCES channels(channelId) ON DELETE CASCADE
    PRIMARY KEY (userId, channelId)
  );

  CREATE TABLE IF NOT EXISTS channels (
    channelId VARCHAR(36) PRIMARY KEY,
    ownerId INTEGER NOT NULL,
    channelName VARCHAR(50) NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(userId) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    messageId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    message TEXT NOT NULL,
    sentDate DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS message_channels (
    messageId INTEGER NOT NULL,
    channelId INTEGER NOT NULL,
    FOREIGN KEY (messageId) REFERENCES messages(messageId) ON DELETE CASCADE
    FOREIGN KEY (channelId) REFERENCES channels(channelId) ON DELETE CASCADE
    PRIMARY KEY (messageId, channelId)
  );
  `;

  db.exec(sql);
}

function connect() {
  const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
      console.log('Connected to SQLite database.');
      createTable(db);
    }
  });

  return db;
}

export default connect();
