const express = require('express');

const docController = require('../controllers/docController');

const router = express.Router();

//Get user info

router.post('/insertDoc/:userID', docController.insertDoc);

router.get('/:userID/:docState', docController.getDocByState);

router.put('/:docID');

module.exports = router;
