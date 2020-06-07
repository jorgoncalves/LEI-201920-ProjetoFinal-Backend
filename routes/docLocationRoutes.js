const express = require('express');

const docLocationController = require('../controllers/docLocationController');

const router = express.Router();

router.get('/getDocsLocations', docLocationController.getDocsLocations);

router.post('/newDocLocation', docLocationController.postDocLocation);

router.put('/updateDocLocation/:docLocationID', docLocationController.updateDocLocation)

module.exports = router;
