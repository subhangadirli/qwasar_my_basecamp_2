const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');
const db = require('../config/database');

const membersController = {
  index(req, res) {
    ProjectMember.findByProject(req.params.id, (err, members) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(members);
    });
  },

  create(req, res) {
    const { username, email } = req.body;
    if (!username && !email) {
      return res.status(400).json({ error: 'Username or email is required' });
    }

    const lookup = (cb) => {
      if (email) return User.findByEmail(email, cb);
      db.get('SELECT * FROM users WHERE username = ?', [username], cb);
    };

    lookup((err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      ProjectMember.add(req.params.id, user.id, 'member', (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.status(201).json({
          message: 'Member added',
          member: { user_id: user.id, username: user.username, email: user.email, role: 'member' }
        });
      });
    });
  },

  destroy(req, res) {
    const userId = parseInt(req.params.userId);
    if (req.project && req.project.owner_id === userId) {
      return res.status(400).json({ error: 'The project owner cannot be removed from membership' });
    }
    ProjectMember.remove(req.params.id, userId, (err) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ message: 'Member removed' });
    });
  }
};

module.exports = membersController;
