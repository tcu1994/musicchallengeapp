var express = require('express');
var router = express.Router();

// Require controller modules.
var authController = require('../controllers/auth');

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
module.exports = router;