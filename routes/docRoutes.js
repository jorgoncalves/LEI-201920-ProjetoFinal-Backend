const express = require('express');

const docController = require('../controllers/docController');

const router = express.Router();

//Get user info

router.get('/getDocsFS', docController.getDocsFS);

router.get('/getDocs', docController.getDocs);

router.get('/getDocsPermissions', docController.getDocsPermissions);

router.post('/insertDoc/:userID', docController.insertDoc);

router.get('/:userID/:docState', docController.getDocByState);

router.put('/:docID', docController.updateDoc);

router.get('/getDocDepart', docController.getDocDepart);

module.exports = router;
