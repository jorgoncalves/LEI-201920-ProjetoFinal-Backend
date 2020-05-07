const { validationResult } = require('express-validator');

const User_Info = require('../models/User_Info');
const Department = require('../models/Department');
const Department_User = require('../models/Department_User');
const Department_Doc = require("../models/Department_Doc");

const { catchAsync } = require('../util/catchAsync');

exports.getLogin = (req, res, next) => {
  res.send('Hello');
};

exports.createDepart = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const departName = req.body.departName;
  const chief_user = req.body.chief_user;

  respFind = await User_Info.findOne({ where: { userID: chief_user } });
  if (!respFind) {
    res.status(400).json({
      status: 400,
      received: req.body,
      message: 'User not found to create Department!'
    });
  }
  else if(respFind){
    const newDepart = new Department({
      name: departName,
      chief_userID: chief_user,
    });
    respSave = await newDepart.save();

    res.json({
      status: 201,
      received: req.body,
      message: 'Department created!',
      data: { respSave },
    });
    console.log('respSave', respSave);
  }
});

exports.getDeparts = catchAsync(async (req, res, next) => {

  if(req.body.id){
    respFind = await Department.findOne({ where: { departmentID: req.body.id } });;
  }else{
    respFind = await Department.findAll();
  }

  if (respFind.length==0) {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Departments Found'
    });
  }
  else {
    res.json({
      status: 201,
      received: req.body,
      message: 'Department(s) found!',
      data: { respFind },
    });
    console.log('respFind', respFind);
  }
});

