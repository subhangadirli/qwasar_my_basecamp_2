const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { isSelfOrAdmin } = require('../middleware/roleCheck');

router.get('/', isLoggedIn, isAdmin, usersController.index);
router.get('/:id', isLoggedIn, usersController.show);
router.post('/', usersController.create);
router.delete('/:id', isLoggedIn, isSelfOrAdmin, usersController.destroy);
router.post('/:id/admin', isLoggedIn, isAdmin, usersController.setAdmin);
router.delete('/:id/admin', isLoggedIn, isAdmin, usersController.removeAdmin);

module.exports = router;