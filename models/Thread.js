const db = require('../config/database');

const Thread = {
  create(project_id, author_id, title, body, callback) {
    db.run(
      'INSERT INTO threads (project_id, author_id, title, body) VALUES (?, ?, ?, ?)',
      [project_id, author_id, title, body],
      function(err) {
        callback(err, { id: this.lastID, project_id, author_id, title, body });
      }
    );
  },

  findByProject(project_id, callback) {
    db.all(`
      SELECT threads.*, users.username as author_name
      FROM threads
      JOIN users ON threads.author_id = users.id
      WHERE threads.project_id = ?
      ORDER BY threads.created_at DESC
    `, [project_id], callback);
  },

  findById(id, callback) {
    db.get(`
      SELECT threads.*, users.username as author_name
      FROM threads
      JOIN users ON threads.author_id = users.id
      WHERE threads.id = ?
    `, [id], callback);
  },

  update(id, title, body, callback) {
    db.run(
      'UPDATE threads SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, body, id],
      callback
    );
  },

  destroy(id, callback) {
    db.run('DELETE FROM threads WHERE id = ?', [id], callback);
  }
};

module.exports = Thread;
