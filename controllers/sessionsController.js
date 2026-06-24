const User = require('../models/User');

const sessionsController = {
  signIn(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    User.findByEmail(email, async (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user) return res.status(401).json({ error: 'Email or password is incorrect' });

      const isValid = await User.validatePassword(password, user.password_hash);
      if (!isValid) return res.status(401).json({ error: 'Email or password is incorrect' });

      req.session.userId = user.id;
      req.session.isAdmin = user.is_admin === 1;

      res.json({
        message: 'Signed in successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_admin: user.is_admin
        }
      });
    });
  },

  signOut(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'An error occurred during sign out' });
      res.json({ message: 'Signed out successfully' });
    });
  }
};

module.exports = sessionsController;