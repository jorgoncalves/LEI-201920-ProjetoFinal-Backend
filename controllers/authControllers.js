const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User_Auth = require('../models/User_Auth');
const User_Info = require('../models/User_Info');

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
<<<<<<< HEAD
      res
        .status(200)
        .json({
          status: 200,
          received: req.body,
          message: 'Email address already exists!',
          data: { respFind },
        });
      console.log('respFind', respFind);
=======
      res.status(200).json({
        status: 200,
        received: req.body,
        message: 'Email address already exists!',
        data: { respFind },
      });
>>>>>>> 1cd514a1279c980616dd3aeb8d1fbcd0ce411ce1
    }
    if (!respFind) {
      const newUser_Auth = new User_Auth({
        email: email,
        password: hashedPw,
        is_active: true,
      });
      respSave = await newUser_Auth.save();

      const newUser_Info = new User_Info({
        userID: respSave.userID,
        name: req.body.name,
        email: email,
        country: req.body.country
      });
      respSave_Info = await newUser_Info.save();

      res.json({
        status: 201,
        received: req.body,
        message: 'User created!',
        data: { respSave, respSave_Info},
      });
      console.log('respSave', respSave);
    }
<<<<<<< HEAD
    // const token = jwt.sign(
    //   {
    //     email: loadedUser.email,
    //     userId: loadedUser._id.toString()
    //   },
    //   'somesupersecretsecret',
    //   { expiresIn: '1h' }
    // );
=======
    console.log('respFind', respFind);
    console.log('respSave', respSave);

    res.json({
      status: 201,
      received: req.body,
      message: 'User created!',
      data: { respFind, respSave },
    });
>>>>>>> 1cd514a1279c980616dd3aeb8d1fbcd0ce411ce1
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
  // const token = jwt.sign(
  //   {
  //     email: loadedUser.email,
  //     userId: loadedUser._id.toString()
  //   },
  //   'somesupersecretsecret',
  //   { expiresIn: '9h' }
  // );
  res.send('PostLogin');
};

exports.logout = (req, res, next) => {};
