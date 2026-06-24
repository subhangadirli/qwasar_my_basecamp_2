const db = require('../config/database');

const ProjectMember = {
  add(project_id, user_id, role, callback) {
    db.run(
      'INSERT OR IGNORE INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
      [project_id, user_id, role || 'member'],
      function(err) {
        callback(err, { id: this.lastID, project_id, user_id, role: role || 'member' });
      }
    );
  },

  findByProject(project_id, callback) {
    db.all(`
      SELECT project_members.id, project_members.user_id, project_members.role,
             project_members.created_at, users.username, users.email
      FROM project_members
      JOIN users ON project_members.user_id = users.id
      WHERE project_members.project_id = ?
      ORDER BY project_members.created_at ASC
    `, [project_id], callback);
  },

  findRole(project_id, user_id, callback) {
    db.get(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [project_id, user_id],
      callback
    );
  },

  remove(project_id, user_id, callback) {
    db.run(
      'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
      [project_id, user_id],
      callback
    );
  }
};

module.exports = ProjectMember;
