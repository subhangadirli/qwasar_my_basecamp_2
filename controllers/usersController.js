const User = require('../models/User');

const usersController = {
  index(req, res) {
    User.getAll((err, users) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(users);
    });
  },

  show(req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    });
  },

  create(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    User.create(username, email, password, (err, user) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'This email or username already exists' });
        }
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json({ message: 'Account created successfully', user });
    });
  },

  destroy(req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      User.destroy(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'User deleted' });
      });
    });
  },

  setAdmin(req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      User.setAdmin(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'Admin privileges granted' });
      });
    });
  },

  removeAdmin(req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      User.removeAdmin(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'Admin privileges revoked' });
      });
    });
  }
};

module.exports = usersController;