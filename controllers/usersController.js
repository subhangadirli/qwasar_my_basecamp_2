const User = require('../models/User');

const usersController = {
  async index(req, res) {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async show(req, res) {
    try {
      const user = await User.findPublicById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async create(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const user = await User.createUser(username, email, password);
      res.status(201).json({ message: 'Account created successfully', user });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'This email or username already exists' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  },

  async destroy(req, res) {
    try {
      const user = await User.findPublicById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      await User.destroyById(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async setAdmin(req, res) {
    try {
      const user = await User.findPublicById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      await User.setAdmin(req.params.id);
      res.json({ message: 'Admin privileges granted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async removeAdmin(req, res) {
    try {
      const user = await User.findPublicById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      await User.removeAdmin(req.params.id);
      res.json({ message: 'Admin privileges revoked' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = usersController;
