const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
  getAll(callback) {
    db.all('SELECT id, username, email, is_admin, created_at FROM users', [], callback);
  },

  findById(id, callback) {
    db.get('SELECT id, username, email, is_admin, created_at FROM users WHERE id = ?', [id], callback);
  },

  findByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  async create(username, email, password, callback) {
    const password_hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash],
      function(err) {
        callback(err, { id: this.lastID, username, email });
      }
    );
  },

  destroy(id, callback) {
    db.run('DELETE FROM users WHERE id = ?', [id], callback);
  },

  setAdmin(id, callback) {
    db.run('UPDATE users SET is_admin = 1 WHERE id = ?', [id], callback);
  },

  removeAdmin(id, callback) {
    db.run('UPDATE users SET is_admin = 0 WHERE id = ?', [id], callback);
  },

  async validatePassword(plainPassword, hash) {
    return await bcrypt.compare(plainPassword, hash);
  }
};

module.exports = User;