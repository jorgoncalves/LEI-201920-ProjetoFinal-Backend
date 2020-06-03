const User_Info = require('../models/User_Info');
const User_Auth = require('../models/User_Auth');
const Department = require('../models/Department');
const Department_User = require('../models/Department_User');

const { catchAsync } = require('../util/catchAsync');

exports.getUsers = catchAsync(async (req, res, next) => {
  respFind = await User_Info.findAll();

  if (respFind) {
    res.json({
      status: 201,
      received: req.body,
      message: 'Users found',
      data: { respFind },
    });
    console.log('respFind', respFind);
  } else {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Users found',
    });
  }
});

// Get user info
exports.getUser = catchAsync(async (req, res, next) => {
  const userID = req.params.id;

  const respFind = await User_Info.findOne({ where: { userID: userID } });
  const respFindAuth = await User_Auth.findOne({ where: { userID: userID } });
  const respFindDepartUser = await Department_User.findAll({
    where: { userID: userID },
  });
  const respFindDepart = await Promise.all(
    respFindDepartUser.map(
      async (departUser) =>
        await Department.findOne({
          where: { departmentID: departUser.departmentID },
        })
    )
  );
  if (respFind) {
    res.json({
      status: 201,
      received: req.body,
      message: 'User found',
      data: { respFind, respFindAuth, respFindDepartUser, respFindDepart },
    });
    // console.log('respFind', respFind);
  } else {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Users found',
    });
  }
});

