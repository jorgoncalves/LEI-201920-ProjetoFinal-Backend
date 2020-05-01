const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User_Auth = require('../models/User_Auth');

exports.getLogin = (req, res, next) => {
  res.send('Hello');
};

exports.signup = async (req, res, next) => {
  //colocar header para apenas permitir criar quando está autenticado e limitado ao admin
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let respFind;
    let respSave;

    const hashedPw = await bcrypt.hash(password, 12);
    console.log('email - ', email);
    console.log('password - ', password);
    console.log('hashedPw - ', hashedPw);

    respFind = await User_Auth.findOne({ where: { email: email } });
    if (respFind) {
      res
        .status(200)
        .json({
          status: 200,
          received: req.body,
          message: 'Email address already exists!',
          data: { respFind },
        });
    }
    if (!respFind) {
      const newUser = new User_Auth({
        email: email,
        password: hashedPw,
        is_active: true,
      });
      respSave = await newUser.save();
    }
    console.log('respFind', respFind);
    console.log('respSave', respSave);
    // const token = jwt.sign(
    //   {
    //     email: loadedUser.email,
    //     userId: loadedUser._id.toString()
    //   },
    //   'somesupersecretsecret',
    //   { expiresIn: '1h' }
    // );
    res.json({
      status: 201,
      received: req.body,
      message: 'User created!',
      data: { respFind, respSave },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('email - ', email);
  console.log('password - ', password);
  res.send('PostLogin');
};

exports.logout = (req, res, next) => {};
