const express = require('express');

const commitController = require('../controllers/commitController');

const router = express.Router();

router.get('/getCommits', commitController.getCommits);

module.exports = router;
