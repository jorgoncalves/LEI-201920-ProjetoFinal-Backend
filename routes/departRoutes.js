const express = require('express');
const { check } = require('express-validator');

const departController = require('../controllers/departController');

const router = express.Router();

router.get('/', departController.getDeparts);

router.post(
  '/create',
  [
    check('departName')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Please enter a valid Department Name'),
    check('chief_user')
      .trim()
      .isLength({ min: 36 })
      .withMessage('Please enter a valid userID'),
  ],
  departController.createDepart
);

router.get(
  '/userDepartColleagues/:id',
  departController.getUserDepartColleagues
);

router.get('/:id', departController.getDepartUsers);

router.post('/:id/insertUser', departController.insertUser_Depart);

module.exports = router;
