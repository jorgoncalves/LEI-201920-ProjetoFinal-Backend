const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/userController');

const router = express.Router();

//Get user info

router.get('/', userController.getUsers);

router.get('/:id', userController.getUser);

module.exports = router;
