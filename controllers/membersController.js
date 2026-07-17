const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');

const membersController = {
  async index(req, res) {
    try {
      const members = await ProjectMember.findByProject(req.params.id);
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async create(req, res) {
    const { username, email } = req.body;
    if (!username && !email) {
      return res.status(400).json({ error: 'Username or email is required' });
    }

    try {
      const user = email
        ? await User.findByEmail(email)
        : await User.findByUsername(username);
      if (!user) return res.status(404).json({ error: 'User not found' });

      await ProjectMember.add(req.params.id, user.id, 'member');
      res.status(201).json({
        message: 'Member added',
        member: { user_id: user.id, username: user.username, email: user.email, role: 'member' }
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async destroy(req, res) {
    const userId = parseInt(req.params.userId);
    if (req.project && req.project.owner_id === userId) {
      return res.status(400).json({ error: 'The project owner cannot be removed from membership' });
    }
    try {
      await ProjectMember.remove(req.params.id, userId);
      res.json({ message: 'Member removed' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = membersController;
