const User_Info = require('../models/User_Info');

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

  respFind = await User_Info.findOne({ where: { userID: userID } });
  console.log(req.clientIp);

  if (respFind) {
    res.json({
      status: 201,
      received: req.body,
      message: 'User found',
      data: { respFind },
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

exports.logout = (req, res, next) => {};
