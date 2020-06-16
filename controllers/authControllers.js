const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const { createToken } = require('./jwtToken');

const User_Auth = require('../models/User_Auth');
const User_Info = require('../models/User_Info');
//PARA REMOVER MAIS TARDE
const Department = require('../models/Department');
const Department_User = require('../models/Department_User');
const Document_Index = require('../models/Document_Index');
const Document_Office_Location = require('../models/Document_Office_Location');
const Record = require('../models/Records');
const Attachments = require('../models/Attachments');
const Commits_Alteration_History = require('../models/Commits_Alteration_History');
const Department_Doc = require('../models/Department_Doc');
const User_Document_permissions = require('../models/User_Document_permissions');

const { catchAsync } = require('../util/catchAsync');

exports.getLogin = (req, res, next) => {
  res.send('Hello');
};

exports.signup = catchAsync(async (req, res, next) => {
  //colocar header para apenas permitir criar quando está autenticado e limitado ao admin
  const errors = validationResult(req);

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
  let respSaveDepart = [];
  const hashedPw = await bcrypt.hash(password, 12);
  console.log('email - ', email);
  console.log('password - ', password);
  console.log('hashedPw - ', hashedPw);

  respFind = await User_Auth.findOne({ where: { email: email } });
  if (respFind) {
    res.status(200).json({
      status: 200,
      received: req.body,
      message: 'Email address already exists!',
      data: { respFind }
    });
    console.log('respFind', respFind);
  }
  if (!respFind) {
    const newUser_Auth = new User_Auth({
      email: email,
      password: hashedPw
    });
    respSave = await newUser_Auth.save();

    const newUser_Info = new User_Info({
      userID: respSave.userID,
      name: req.body.name,
      email: email,
      country: req.body.country,
      country_code: req.body.country_code,
      phone_number: req.body.phone_number
    });
    respSave_Info = await newUser_Info.save();

    if (req.body.departmentList.length > 0) {
      for await (const depart of req.body.departmentList) {
        const departResp = await Department_User.findOne({
          where: {
            departmentID: depart.departmentID,
            userID: respSave.userID
          }
        });

        if (!departResp) {
          console.log('true');
          const departListUpdate = new Department_User({
            departmentID: depart.departmentID,
            userID: respSave.userID,
            has_ext_access: false
          });
          const resp = await departListUpdate.save();
          respSaveDepart.push(resp);
        }
      }
    }

    res.json({
      status: 201,
      message: 'User signedup!',
      data: {
        token: createToken(
          respSave_Info.userID.toString(),
          respSave_Info.email,
          respSave_Info.name
        )
      },
      respFind,
      respSave,
      respSaveDepart,
      respSave_Info
    });
    console.log('respSave', respSave_Info);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, password } = req.body;
  console.log('Email - ', email);
  console.log('Password - ', password);

  const user = await User_Auth.findOne({
    where: { email: email, is_active: true }
  });

  if (!user) {
    const error = new Error('Could not find a user with that email.');
    error.statusCode = 401;
    throw error;
  }
  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    const error = new Error('Wrong password!!');
    error.statusCode = 401;
    throw error;
  }
  console.log(user);

  res.status(200).json({
    status: 201,
    message: 'User loggedin!',
    data: {
      token: createToken(
        req.clientIp,
        user.userID.toString(),
        user.email,
        user.name,
        user.is_admin
      )
    }
  });
});
