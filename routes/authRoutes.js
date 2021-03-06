const express = require('express');
const { check } = require('express-validator');

const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.get('/', authControllers.getLogin);

router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    check('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a valid password'),
  ],
  authControllers.login
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    check('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a valid password'),
  ],
  authControllers.signup
);

module.exports = router;
