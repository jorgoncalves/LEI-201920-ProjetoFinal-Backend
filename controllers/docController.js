const fs = require('fs');
const path = require('path');

require('../models/Department');
const Department_Doc = require('../models/Department_Doc');
require('../models/User_Info');
const User_Document_permissions = require('../models/User_Document_permissions');
const Document_Index = require('../models/Document_Index');
require('../models/Document_Office_Location');
const Commit = require('../models/Commits_Alteration_History');
// require('../models/Attachments')
// require('../models/Records')

const {
  updateDocState,
  updateUserDocPermissions,
  updateDepartmentDoc,
} = require('./docControllerFunctions/updateDoc');

const { catchAsync } = require('../util/catchAsync');

exports.getDocs = async (req, res, next) => {
  //colcar lógica para aceitar parametros
  try {
    const { optionPath } = req.body;

    const rootPath = optionPath
      ? path.join('./', 'FileStorage', optionPath)
      : path.join('./', 'FileStorage');

    const getDirectories = (source) =>
      fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && dirent.name != 'temp')
        .map((dirent) => dirent.name);
    const respObj = getDirectories(rootPath);
    res.status(201).json({
      status: 201,
      message: 'Documents found!',
      data: {
        options: {},
        dirs: [...respObj],
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Document not found!',
      data: {
        error,
      },
    });
  }
};

exports.insertDoc = catchAsync(async (req, res, next) => {
  try {
    const { userID } = req.params;
    let documentID_old = null;
    console.log(req.file);

    //aproving user dá origem a notificação

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
      `FileStorage`,
      `temp`,
      `${req.file.filename}`
    );
    let newPath;
    //versão deverá ser dinamica
    const dir = path.join(`FileStorage`, `${name}`);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      const v = path.join(`FileStorage`, `${name}`, `1`);
      fs.mkdirSync(v);
      newPath = path.join(
        `FileStorage`,
        `${name}`,
        `1`,
        `${req.file.filename}`
      );

      //fazer commit
    } else {
      const existingDir = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && dirent.name != 'Registos')
        .map((dirent) => dirent.name);

      const newV = parseInt(existingDir[existingDir.length - 1]) + 1;
      console.log('newV', newV);
      const v = path.join(`FileStorage`, `${name}`, `${newV}`);
      fs.mkdirSync(v);

      newPath = path.join(
        `FileStorage`,
        `${name}`,
        `${newV}`,
        `${req.file.filename}`
      );
      const oldDocumentIndex = await Document_Index.findOne({
        where: { name: name },
        order: [['created_on', 'DESC']],
      });
      oldDocumentIndex.status = 'obsolete';
      await oldDocumentIndex.save();
      documentID_old = oldDocumentIndex.dataValues.documentID;

      //atualizar o Document_Index do doc antigo para obsoleto
      //fazer commit
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
    const documentID_new = saveResp.documentID;
    const commit = new Commit({
      userID,
      documentID_old,
      documentID_new,
      status,
    });
    console.log('commit', commit);
    const respCommit = await commit.save();
    //inserir lógica dos commits
    editUsersList = JSON.parse(editUsersList);
    const editUsersResp = [];
    //é necessario discutir has_ext_access
    editUsersList.push(userID);
    for await (const userID of editUsersList) {
      const UserDocPermission = new User_Document_permissions({
        documentID: documentID_new,
        userID: userID,
        type_access: 1,
        has_ext_access: 0,
      });
      const respS = await UserDocPermission.save();
      editUsersResp.push(respS);
    }
    consultUsersList = JSON.parse(consultUsersList);
    const consultUsersResp = [];
    for await (const userID of consultUsersList) {
      const UserDocPermission = new User_Document_permissions({
        documentID: documentID_new,
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
        documentID: documentID_new,
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
      respCommit,
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

exports.updateDoc = async (req, res, next) => {
  const documentID = req.params.docID;
  let {
    newStatus,
    description,
    is_public,
    is_external,
    approving_userID,
    editUsersList,
    consultUsersList,
    departmentList,
  } = req.body;
  const oldDocumentIndex = await Document_Index.findByPk(documentID);
  const oldDocCommit = await Commit.findOne({
    where: { documentID_new: documentID },
    order: [['created_on', 'DESC']],
  });

  try {
    let respUpdateDocState;
    let respEditUsersList;
    let respConsultUsersList;
    let respDepartmentList;
    const updateObj = {
      newStatus,
      description,
      is_public,
      is_external,
      approving_userID,
    };
    if (
      newStatus ||
      description ||
      is_public ||
      is_external ||
      approving_userID
    )
      respUpdateDocState = await updateDocState(documentID, updateObj);
    if (editUsersList) {
      editUsersList = JSON.parse(editUsersList);
      editUsersList.push(oldDocCommit.userID);
      respEditUsersList = await updateUserDocPermissions(
        documentID,
        1,
        editUsersList
      );
    }
    if (consultUsersList) {
      consultUsersList = JSON.parse(consultUsersList);
      consultUsersList.push(oldDocumentIndex.approving_userID);
      respConsultUsersList = await updateUserDocPermissions(
        documentID,
        2,
        consultUsersList
      );
    }
    if (departmentList) {
      departmentList = JSON.parse(departmentList);
      console.log('departmentList', departmentList.length);

      if (departmentList.length > 0)
        respDepartmentList = await updateDepartmentDoc(
          documentID,
          departmentList
        );
    }
    const respObj = {
      respUpdateDocState,
      respEditUsersList,
      respConsultUsersList,
      respDepartmentList,
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
};

exports.getDocByState = catchAsync(async (req, res, next) => {
  const { userID, docState } = req.params;
});

exports.documentOfficeLocation = catchAsync();
