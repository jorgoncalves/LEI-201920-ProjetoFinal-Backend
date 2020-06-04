const fs = require('fs');

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
    //é necessario receber o file
    //não esquecer se implimentar essa lógica
    //aproving user dá origem a notificação

    //default status 'pending'
    //is_public vem do frontend como boollean
    const {
      name,
      status,
      approving_UserID,
      description,
      is_public,
      is_external,
      editUsersList,
      consultUsersList,
      departmentList,
    } = req.body;

    const path = '/qualquercoisa';
    const file_extension = '.ze';
    const size = '101'; //em b por default

    //path,size,file_extension assim que for escrito no fs
    const newDoc = new Document_Index({
      name,
      status,
      approving_UserID,
      description,
      is_public,
      is_external,
      path,
      file_extension,
      size,
    });
    const saveResp = await newDoc.save();
    const documentID = saveResp.documentID;

    //inserir lógica dos commits

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
    const consultUsersResp = [];
    consultUsersList.push(approving_UserID);
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
        respObj,
      },
    });
  } catch (error) {
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
