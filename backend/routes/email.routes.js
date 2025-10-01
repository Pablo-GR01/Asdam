const express = require('express');
const router = express.Router();
const emailController = require('../controller/email.controller');

// POST /api/email/send
router.post('/send', emailController.sendEmail);

module.exports = router;
