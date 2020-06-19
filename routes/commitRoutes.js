const express = require('express');

const commitController = require('../controllers/commitController');

const router = express.Router();

router.get('/getCommits/:documentID_new', commitController.getCommits);

module.exports = router;
