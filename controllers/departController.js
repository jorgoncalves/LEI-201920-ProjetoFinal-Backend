const { validationResult } = require('express-validator');

const User_Info = require('../models/User_Info');
const User_Auth = require('../models/User_Auth');
const Department = require('../models/Department');
const Department_User = require('../models/Department_User');
const Department_Doc = require('../models/Department_Doc');

const { catchAsync } = require('../util/catchAsync');

exports.updateDepart = async (req, res, next) => {
  const departmentID = req.params.id;
  try {
    const { departName, chief_user, description } = req.body;

    const newDepartData = await Department.findByPk(departmentID);
    newDepartData.name = departName;
    newDepartData.chief_userID = chief_user;
    newDepartData.description = description;

    const respUpdate = await newDepartData.save();

    const respObj = {
      respUpdate
    };
    res.status(200).json({
      status: 201,
      message: 'Department updated!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Department was not updated!',
      data: {
        error
      }
    });
  }
};

// MODEL DEPARTMENT
// CREATE DEPARTMENT AND ASSOCIATE CHIEF USER TO IT AUTOMAGICALLY
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
  const description = req.body.description;

  respFind = await User_Info.findOne({ where: { userID: chief_user } });
  if (!respFind) {
    res.status(400).json({
      status: 400,
      received: req.body,
      message: 'User not found to create Department!'
    });
  } else if (respFind) {
    const newDepart = new Department({
      name: departName,
      chief_userID: chief_user,
      description
    });
    respSave1 = await newDepart.save();

    respFindDepart = await Department.findOne({
      where: { departmentID: respSave1.departmentID }
    });
    // console.log('respFindDepart', respFindDepart);

    const newUser_Depart = new Department_User({
      departmentID: respSave1.departmentID,
      userID: chief_user,
      has_ext_access: true
    });
    respSave2 = await newUser_Depart.save();

    res.json({
      status: 201,
      received: req.body,
      message: 'Department Created and User associated',
      data: [{ respSave1 }, { respSave2 }]
    });
    // console.log('respSave-createDepart', [{ respSave1 }, { respSave2 }]);

    // res.json({
    //   status: 201,
    //   received: req.body,
    //   message: 'Department created!',
    //   data: { respSave },
    // });
    //console.log('respSave', respSave);
  }
});

// GET LIST OF ONE/ALL DEPARTMENT(s)
exports.getDeparts = catchAsync(async (req, res, next) => {
  if (req.query.departmentID) {
    respFind = await Department.findOne({
      where: { departmentID: req.query.departmentID }
    });
  } else {
    respFind = await Department.findAll();
  }

  if (respFind.length == 0) {
    res.status(404).json({
      status: 404,
      received: req.query,
      message: 'No Departments Found'
    });
  } else {
    res.json({
      status: 201,
      received: req.query,
      message: 'Department(s) found!',
      data: { respFind }
    });
    // console.log('respFind', respFind);
  }
});

//MODEL DEPARTMENT_USER
// GET ALL USERS FROM DEPARTMENT
exports.getDepartUsers = catchAsync(async (req, res, next) => {
  const departID = req.params.id;

  respFind = await Department_User.findAll({
    where: { departmentID: departID }
  });

  if (respFind) {
    res.json({
      status: 201,
      received: req.body,
      message: 'Users found in Department',
      data: { respFind }
    });
    // console.log('respFind', respFind);
  } else {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Users found in this department'
    });
  }
});

// INSERT ONE USER INTO DEPARTMENT
exports.insertUser_Depart = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  departIns = await Department.findOne({
    where: { departmentID: req.params.id }
  });

  if (departIns.length == 0) {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Departments Found with input id=' + req.params.id
    });
  } else {
    userIns = await User_Info.findOne({ where: { userID: req.body.userID } });

    if (userIns.length == 0) {
      res.status(404).json({
        status: 404,
        received: req.body,
        message: 'No Users Found with input userID=' + req.body.userID
      });
    } else {
      const newUser_Depart = new Department_User({
        departmentID: req.params.id,
        userID: req.body.userID,
        has_ext_access: req.body.has_ext_access
      });
      respSave = await newUser_Depart.save();

      res.json({
        status: 201,
        received: req.body,
        message: 'User associated with Department!',
        data: { respSave }
      });
      // console.log('respSave', respSave);
    }
  }
});

exports.getUserDepartColleagues = catchAsync(async (req, res, next) => {
  const userID = req.params.id;

  // respFindUser_Info = await User_Info.findOne({
  //   where: { userID: userID },
  // });
  // respFindUser_Auth = await User_Auth.findOne({
  //   where: { userID: userID },
  // });
  const respFindUserDepart = await Department_User.findAll({
    where: { userID: userID }
  });
  const respDepartUsers = [];

  for await (const userDepart of respFindUserDepart) {
    const departInfo = await Department.findOne({
      where: { departmentID: userDepart.departmentID }
    });
    const allDepartUsers = await Department_User.findAll({
      where: { departmentID: userDepart.departmentID }
    });
    const userInDepartInfo = [];
    for await (const userInDepart of allDepartUsers) {
      const userInfo = await User_Info.findOne({
        where: { userID: userInDepart.userID }
      });
      const userAuth = await User_Auth.findOne({
        where: { userID: userInDepart.userID }
      });
      // console.log(userAuth);

      delete userAuth.dataValues.password;

      userInDepartInfo.push({
        userInfo,
        userAuth
      });
    }

    respDepartUsers.push({
      departInfo: { ...departInfo.dataValues, userInDepartInfo }
    });
  }

  if (respDepartUsers) {
    res.json({
      status: 201,
      received: req.body,
      message: 'Users found in Department',
      data: { respDepartUsers }
    });
    // console.log('respDepartUsers', respDepartUsers);
  } else {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Users found in this department'
    });
  }
});
