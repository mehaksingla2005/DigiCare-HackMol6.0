const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/user');

router.get('/getProfile', getUser);

module.exports = router;
