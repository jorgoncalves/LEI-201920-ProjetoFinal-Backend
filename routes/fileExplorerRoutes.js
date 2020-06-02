const express = require('express');

const fileExplorerController = require('../controllers/fileExplorerController');

const router = express.Router();

router.get('/', fileExplorerController.getFilesTree);

module.exports = router;