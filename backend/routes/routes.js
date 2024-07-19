const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Auth routes
router.post('/signup', controller.signup);
router.post('/', controller.login);

module.exports = router;
