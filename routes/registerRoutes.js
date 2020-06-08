const express = require('express');

const registerController = require('../controllers/registerController');

const router = express.Router();

//Get user info

router.get('/getRecords', registerController.getRecords);

router.post('/postRecord', registerController.postRecord);

// router.get('/:userID/:docState', docController.getDocByState);

// router.put('/:docID', docController.updateDoc);

module.exports = router;
