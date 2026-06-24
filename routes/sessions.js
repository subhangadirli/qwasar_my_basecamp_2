const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');

router.post('/signin', sessionsController.signIn);
router.delete('/signout', sessionsController.signOut);

module.exports = router;