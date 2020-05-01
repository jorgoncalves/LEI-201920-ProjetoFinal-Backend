const express = require('express');
const { body } = require('express-validator/check');

const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.get('/', authControllers.getLogin);

router.post('/', authControllers.login);

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a valid password'),
  ],
  authControllers.signup
);

module.exports = router;
