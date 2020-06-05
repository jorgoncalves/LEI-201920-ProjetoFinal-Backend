const fs = require('fs');
const path = require('path');

require('../models/Department');
const Department_Doc = require('../models/Department_Doc');
require('../models/User_Info');
const User_Document_permissions = require('../models/User_Document_permissions');
const Document_Index = require('../models/Document_Index');
require('../models/Document_Office_Location');
require('../models/Commits_Alteration_History');
// require('../models/Attachments')
// require('../models/Records')

const { catchAsync } = require('../util/catchAsync');

exports.insertDoc = catchAsync(async (req, res, next) => {
  try {
    const { userID } = req.params;
    console.log(req.file);

    //é necessario receber o file
    //não esquecer se implimentar essa lógica
    //aproving user dá origem a notificação

    //default status 'pending'
    //is_public vem do frontend como boollean
    let {
      name,
      status,
      approving_userID,
      description,
      is_public,
      is_external,
      editUsersList,
      consultUsersList,
      departmentList,
    } = req.body;
    const currentPath = path.join(
      __dirname,
      '..',
      `FileStorage`,
      `temp`,
      `${req.file.filename}`
    );
    let newPath;
    //versão deverá ser dinamica
    const dir = path.join(__dirname, '..', `FileStorage`, `${name}`);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      const v = path.join(__dirname, '..', `FileStorage`, `${name}`, `1`);
      fs.mkdirSync(v);
      newPath = path.join(
        __dirname,
        '..',
        `FileStorage`,
        `${name}`,
        `1`,
        `${req.file.filename}`
      );
    } else {
      const existingDir = fs.readdirSync(dir);

      const newV = parseInt(existingDir[existingDir.length - 1]) + 1;
      console.log('newV', newV);
      const v = path.join(__dirname, '..', `FileStorage`, `${name}`, `${newV}`);
      fs.mkdirSync(v);

      newPath = path.join(
        __dirname,
        '..',
        `FileStorage`,
        `${name}`,
        `${newV}`,
        `${req.file.filename}`
      );
    }
    fs.renameSync(currentPath, newPath);

    const filePath = newPath;
    const file_extension = req.file.mimetype;
    const size = req.file.size; //em b por default
    console.log(approving_userID);

    //path,size,file_extension assim que for escrito no fs
    const newDoc = new Document_Index({
      name,
      status,
      approving_userID,
      description,
      is_public,
      is_external,
      path: filePath,
      file_extension,
      size,
    });
    const saveResp = await newDoc.save();
    const documentID = saveResp.documentID;

    //inserir lógica dos commits
    editUsersList = JSON.parse(editUsersList);
    const editUsersResp = [];
    //é necessario discutir has_ext_access
    editUsersList.push(userID);
    for await (const userID of editUsersList) {
      const UserDocPermission = new User_Document_permissions({
        documentID: documentID,
        userID: userID,
        type_access: 1,
        has_ext_access: 0,
      });
      const respS = await UserDocPermission.save();
      editUsersResp.push(respS);
    }
    consultUsersList = JSON.parse(consultUsersList);
    const consultUsersResp = [];
    consultUsersList.push(approving_userID);
    for await (const userID of consultUsersList) {
      const UserDocPermission = new User_Document_permissions({
        documentID: documentID,
        userID: userID,
        type_access: 2,
        has_ext_access: 0,
      });
      const respS = await UserDocPermission.save();
      consultUsersResp.push(respS);
    }
    departmentList = JSON.parse(departmentList);
    const departmentResp = [];
    for await (const departID of departmentList) {
      const DepartmentDoc = new Department_Doc({
        documentID: documentID,
        departmentID: departID,
      });
      const respS = await DepartmentDoc.save();
      departmentResp.push(respS);
    }
    const respObj = {
      saveResp,
      editUsersResp,
      consultUsersResp,
      departmentResp,
    };
    res.status(200).json({
      status: 201,
      message: 'Document saved!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Document not saved!',
      data: {
        error,
      },
    });
  }
});

exports.getDocByState = catchAsync(async (req, res, next) => {
  const { userID, docState } = req.params;
});

exports.documentOfficeLocation = catchAsync();
