// routes/confirmation.routes.js
const express = require('express');
const router = express.Router();
const { confirmerPresence } = require('../controller/confirmation.controller');

router.get('/confirmation', confirmerPresence);

module.exports = router;
