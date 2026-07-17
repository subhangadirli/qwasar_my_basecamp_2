const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

const dataDir = path.join(__dirname, '../data');
const DB_PATH = process.env.DB_PATH || path.join(dataDir, 'basecamp.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_PATH,
  logging: false
});

// SQLite does not enforce foreign keys (and ON DELETE CASCADE) unless the
// pragma is enabled on every connection.
sequelize.afterConnect((connection) => new Promise((resolve, reject) => {
  connection.run('PRAGMA foreign_keys = ON', (err) => (err ? reject(err) : resolve()));
}));

module.exports = sequelize;
