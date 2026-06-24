const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Login required' });
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Admin permission required' });
};

module.exports = { isLoggedIn, isAdmin };