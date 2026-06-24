const db = require('../config/database');

const Attachment = {
  create({ project_id, uploader_id, filename, original_name, format, size }, callback) {
    db.run(
      `INSERT INTO attachments (project_id, uploader_id, filename, original_name, format, size)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, uploader_id, filename, original_name, format, size],
      function(err) {
        callback(err, { id: this.lastID, project_id, uploader_id, filename, original_name, format, size });
      }
    );
  },

  findByProject(project_id, callback) {
    db.all(`
      SELECT attachments.*, users.username as uploader_name
      FROM attachments
      JOIN users ON attachments.uploader_id = users.id
      WHERE attachments.project_id = ?
      ORDER BY attachments.created_at DESC
    `, [project_id], callback);
  },

  findById(id, callback) {
    db.get('SELECT * FROM attachments WHERE id = ?', [id], callback);
  },

  destroy(id, callback) {
    db.run('DELETE FROM attachments WHERE id = ?', [id], callback);
  }
};

module.exports = Attachment;
