const db = require('../config/database');

const Project = {
  getAll(callback) {
    db.all(`
      SELECT projects.*, users.username as owner_name 
      FROM projects 
      JOIN users ON projects.owner_id = users.id
    `, [], callback);
  },

  findById(id, callback) {
    db.get(`
      SELECT projects.*, users.username as owner_name 
      FROM projects 
      JOIN users ON projects.owner_id = users.id 
      WHERE projects.id = ?
    `, [id], callback);
  },

  findByOwner(owner_id, callback) {
    db.all('SELECT * FROM projects WHERE owner_id = ?', [owner_id], callback);
  },

  create(name, description, owner_id, callback) {
    db.run(
      'INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)',
      [name, description, owner_id],
      function(err) {
        callback(err, { id: this.lastID, name, description, owner_id });
      }
    );
  },

  update(id, name, description, callback) {
    db.run(
      'UPDATE projects SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, id],
      callback
    );
  },

  destroy(id, callback) {
    db.run('DELETE FROM projects WHERE id = ?', [id], callback);
  }
};

module.exports = Project;