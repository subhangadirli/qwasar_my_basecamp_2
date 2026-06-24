const db = require('../config/database');

const Message = {
  create(thread_id, author_id, body, callback) {
    db.run(
      'INSERT INTO messages (thread_id, author_id, body) VALUES (?, ?, ?)',
      [thread_id, author_id, body],
      function(err) {
        callback(err, { id: this.lastID, thread_id, author_id, body });
      }
    );
  },

  findByThread(thread_id, callback) {
    db.all(`
      SELECT messages.*, users.username as author_name
      FROM messages
      JOIN users ON messages.author_id = users.id
      WHERE messages.thread_id = ?
      ORDER BY messages.created_at ASC
    `, [thread_id], callback);
  },

  findById(id, callback) {
    db.get('SELECT * FROM messages WHERE id = ?', [id], callback);
  },

  update(id, body, callback) {
    db.run(
      'UPDATE messages SET body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [body, id],
      callback
    );
  },

  destroy(id, callback) {
    db.run('DELETE FROM messages WHERE id = ?', [id], callback);
  }
};

module.exports = Message;
