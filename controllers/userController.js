const User_Info = require('../models/User_Info');
const User_Auth = require('../models/User_Auth');
const Department = require('../models/Department');
const Department_User = require('../models/Department_User');
const User_Notification = require('../models/User_Notification');
const { catchAsync } = require('../util/catchAsync');

exports.getUsers = catchAsync(async (req, res, next) => {
  respFind = await User_Info.findAll();

  if (respFind) {
    res.json({
      status: 201,
      received: req.body,
      message: 'Users found',
      data: { respFind }
    });
  } else {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Users found'
    });
  }
});

// Get user info
exports.getUser = catchAsync(async (req, res, next) => {
  const userID = req.params.id;
  const respFind = await User_Info.findOne({ where: { userID: userID } });
  const respFindAuth = await User_Auth.findOne({ where: { userID: userID } });
  const respFindDepartUser = await Department_User.findAll({
    where: { userID: userID }
  });
  const respFindDepart = [];
  for (const departUser of respFindDepartUser) {
    const resp = await Department.findOne({
      where: { departmentID: departUser.departmentID }
    });
    respFindDepart.push(resp);
  }

  if (respFind) {
    res.json({
      status: 201,
      received: req.body,
      message: 'User found',
      data: { respFind, respFindAuth, respFindDepartUser, respFindDepart }
    });
    // console.log('respFind', respFind);
  } else {
    res.status(404).json({
      status: 404,
      received: req.body,
      message: 'No Users found'
    });
  }
});

exports.updateUser = async (req, res, next) => {
  const userID = req.params.id;
  try {
    const {
      name,
      country,
      country_code,
      phone_number,
      user_display,
      profile_img_path,
      departmentList,
      deleteFromDepart,
      has_ext_access = false,
      is_active
    } = req.body;

    const userInfo = await User_Info.findByPk(userID);

    let respSaveDepart = [];
    let respDeleteDepart = [];
    let respSaveAuth;
    if (name) userInfo.name = name;
    if (country) userInfo.country = country;
    if (country_code) userInfo.country_code = country_code;
    if (phone_number) userInfo.phone_number = phone_number;
    if (user_display) userInfo.user_display = user_display;
    if (profile_img_path) userInfo.profile_img_path = profile_img_path;

    const newUserInfo = await userInfo.save();
    console.log(req.body);

    if (departmentList.length > 0) {
      for await (const depart of departmentList) {
        const departResp = await Department_User.findOne({
          where: {
            departmentID: depart.departmentID,
            userID: userID
          }
        });

        if (!departResp) {
          console.log('true');
          const departListUpdate = new Department_User({
            departmentID: depart.departmentID,
            userID: userID,
            has_ext_access: has_ext_access
          });
          const resp = await departListUpdate.save();
          respSaveDepart.push(resp);
        }
      }
    }

    if (deleteFromDepart.length > 0) {
      for await (const depart of deleteFromDepart) {
        const resp = await Department_User.destroy({
          where: {
            departmentID: depart.departmentID,
            userID: userID
          }
        });
        respSaveDepart.push(resp);
      }
    }

    if (is_active !== undefined) {
      const userAuth = await User_Auth.findByPk(userID);
      userAuth.is_active = is_active;
      const resp = await userAuth.save();
      respSaveAuth = resp;
    }

    res.json({
      status: 201,
      received: req.body,
      message: 'User updated',
      data: { newUserInfo, respSaveAuth, respSaveDepart, respDeleteDepart }
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: 404,
      received: req.body,
      received: error,
      message: 'User not updated'
    });
  }
};

exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const userID = req.params.id;
  try {
    respFind = await User_Notification.findAll({
      where: { was_seen: false, receivingUserID: userID }
    });

    if (respFind) {
      res.json({
        status: 201,
        received: req.body,
        message: 'Notifications found',
        data: { respFind }
      });
    } else {
      res.status(404).json({
        status: 404,
        received: req.body,
        message: 'No Notifications found'
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 404,
      received: req.body,
      received: error,
      message: 'Error!'
    });
  }
});
