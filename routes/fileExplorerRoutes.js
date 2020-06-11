const express = require('express');

const fileExplorerController = require('../controllers/fileExplorerController');

const router = express.Router();

router.get('/getFile', fileExplorerController.getFile);

router.get('/', fileExplorerController.getFilesTree);

module.exports = router;
