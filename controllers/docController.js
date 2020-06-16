const fs = require('fs');
const path = require('path');
const { QueryTypes } = require('sequelize');
const sequelize = require('../util/database');
const { Op } = require('sequelize');

// require('../models/Department');
const Department_Doc = require('../models/Department_Doc');
// require('../models/User_Info');
const User_Document_permissions = require('../models/User_Document_permissions');
const Document_Index = require('../models/Document_Index');
// require('../models/Document_Office_Location');
const Commit = require('../models/Commits_Alteration_History');
// require('../models/Attachments')
// require('../models/Records')

const {
  updateDocState,
  updateUserDocPermissions,
  updateDepartmentDoc,
  notifyByDocState
} = require('./docControllerFunctions/updateDoc');

const { catchAsync } = require('../util/catchAsync');
const User_Info = require('../models/User_Info');

exports.getDocsFS = async (req, res, next) => {
  //colcar lógica para aceitar parametros
  try {
    const { optionPath } = req.body;

    const rootPath = optionPath
      ? path.join('./', 'FileStorage', optionPath)
      : path.join('./', 'FileStorage');

    const getDirectories = (source) =>
      fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.name != 'temp')
        .map((dirent) => dirent.name);
    const respObj = getDirectories(rootPath);
    res.status(201).json({
      status: 201,
      message: 'Documents found!',
      data: {
        options: {},
        dirs: [...respObj]
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Document not found!',
      data: {
        error
      }
    });
  }
};
exports.getDocs = async (req, res, next) => {
  try {
    const {
      name,
      path: newPath,
      file_extension,
      isModelFile,
      has_records,
      status,
      approving_userID,
      description,
      is_public,
      is_external,
      size
    } = req.query;
    delete req.query.status;
    let documents;
    if (status !== undefined)
      documents = await Document_Index.findAll({
        where: { status: { [Op.or]: [status] }, ...req.query }
      });
    else
      documents = await Document_Index.findAll({
        where: { ...req.query }
      });
    const respObj = { documents };
    res.status(201).json({
      status: 201,
      message: 'Documents found!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Documents not found!',
      data: {
        error
      }
    });
  }
};

exports.getDocsPermissions = async (req, res, next) => {
  try {
    const {
      documentID,
      name,
      path,
      file_extension,
      isModelFile,
      has_records,
      status,
      approving_userID,
      description,
      is_public,
      is_external,
      size,
      userID
    } = req.query;

    console.log(req.query);
    delete req.body.userID;

    // const documents = await Document_Index.findAll({ where: { ...req.body } });
    let resp = await sequelize.query(
      `SELECT *
    FROM public.user_document_permissions Inner Join public.document_indices 
    on user_document_permissions."documentID" = document_indices."documentID" 
    where  1=1 ${
      userID ? `and user_document_permissions."userID" = '${userID}'` : ''
    } 
    ${name ? ` and document_indices."name"='${name}'` : ''}
    ${documentID ? ` and document_indices."documentID"='${documentID}'` : ''}
    ${
      file_extension
        ? ` and document_indices."file_extension"='${file_extension}'`
        : ''
    }
    ${isModelFile ? ` and document_indices."isModelFile"='${isModelFile}'` : ''}
      ${
        has_records
          ? ` and document_indices."has_records"='${has_records}'`
          : ''
      }
      ${status ? ` and document_indices."status"='${status}'` : ''}
      ${
        approving_userID
          ? ` and document_indices."approving_userID"='${approving_userID}'`
          : ''
      }
      ${is_public ? ` and document_indices."is_public"='${is_public}'` : ''}
      ${
        is_external
          ? ` and document_indices."is_external"='${is_external}'`
          : ''
      };`,
      {
        type: QueryTypes.SELECT
      }
    );

    let documents = [];

    for await (const doc of resp) {
      const newDoc = doc;
      const temp = await User_Info.findByPk(newDoc.approving_userID);
      if (temp !== null) newDoc.approvingUser_Data = temp.dataValues;
      else newDoc.approvingUser_Data = {};

      documents.push(newDoc);
    }

    const respObj = { documents };
    res.status(201).json({
      status: 201,
      message: 'Documents found!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Documents not found!',
      data: {
        error
      }
    });
  }
};

exports.getDocDepart = async (req, res, next) => {
  try {
    const docPermisions = await Department_Doc.findAll({
      where: { ...req.query }
    });
    const respObj = { docPermisions };
    res.status(201).json({
      status: 201,
      message: 'Permissions found!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Something whent wrong!',
      data: {
        error
      }
    });
  }
};

exports.insertDoc = catchAsync(async (req, res, next) => {
  try {
    const { userID } = req.params;
    let documentID_old = null;
    //aproving user dá origem a notificação

    //is_public vem do frontend como boollean
    let {
      name, //mandar sempre o nome do doc anterior
      isModelFile,
      has_records,
      status,
      approving_userID,
      description,
      is_public,
      is_external,
      editUsersList,
      consultUsersList,
      departmentList
    } = req.body;
    const currentPath = path.join(
      `FileStorage`,
      `temp`,
      `${req.file.filename}`
    );
    let newPath;
    console.log(req.file);

    const fileExtension = req.file.filename.split('.')[1];
    const dir = path.join(`FileStorage`, `${name}`);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      const v = path.join(`FileStorage`, `${name}`, `1`);
      fs.mkdirSync(v);
      req.file.filename = `${name}[version_1].${fileExtension}`;
      newPath = path.join(
        `FileStorage`,
        `${name}`,
        `1`,
        `${req.file.filename}`
      );
    } else {
      const existingDir = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && dirent.name != 'Registos')
        .map((dirent) => dirent.name);
      console.log(existingDir);

      const newV =
        existingDir.length === 0
          ? 1
          : parseInt(existingDir[existingDir.length - 1]) + 1;
      console.log('newV', newV);
      const v = path.join(`FileStorage`, `${name}`, `${newV}`);
      fs.mkdirSync(v);

      req.file.filename = `${name}[version_${newV}].${fileExtension}`;
      newPath = path.join(
        `FileStorage`,
        `${name}`,
        `${newV}`,
        `${req.file.filename}`
      );
      const oldDocumentIndex = await Document_Index.findOne({
        where: { name: name },
        order: [['created_on', 'DESC']]
      });
      if (oldDocumentIndex !== null && oldDocumentIndex.status !== 'approved') {
        oldDocumentIndex.status = 'obsolete';
        await oldDocumentIndex.save();
        documentID_old = oldDocumentIndex.dataValues.documentID;
      }

      //atualizar o Document_Index do doc antigo para obsoleto
      //fazer commit
    }
    fs.renameSync(currentPath, newPath);

    //path,size,file_extension assim que for escrito no fs
    const newDoc = new Document_Index({
      name,
      path: newPath,
      file_extension: req.file.mimetype,
      isModelFile,
      has_records,
      status,
      approving_userID,
      description,
      is_public,
      is_external,
      size: req.file.size
    });
    const saveResp = await newDoc.save();
    const documentID_new = saveResp.documentID;
    let commit =
      documentID_old !== null
        ? new Commit({
            userID,
            documentID_old,
            documentID_new,
            status
          })
        : new Commit({
            userID,
            documentID_new,
            status
          });
    const respCommit = await commit.save();

    editUsersList = JSON.parse(editUsersList);
    const editUsersResp = [];
    //é necessario discutir has_ext_access
    editUsersList.push(userID);
    console.log(editUsersList);

    for await (const userID of editUsersList) {
      console.log(userID);

      const UserDocPermission = new User_Document_permissions({
        documentID: documentID_new,
        userID: userID,
        type_access: 1,
        has_ext_access: 0
      });
      const respS = await UserDocPermission.save();
      editUsersResp.push(respS);
    }
    consultUsersList = JSON.parse(consultUsersList);
    if (approving_userID != undefined && approving_userID !== userID)
      consultUsersList.push(approving_userID);
    const consultUsersResp = [];
    for await (const userID of consultUsersList) {
      const UserDocPermission = new User_Document_permissions({
        documentID: documentID_new,
        userID: userID,
        type_access: 2,
        has_ext_access: 0
      });
      const respS = await UserDocPermission.save();
      consultUsersResp.push(respS);
    }
    departmentList = JSON.parse(departmentList);
    const departmentResp = [];
    for await (const departID of departmentList) {
      const DepartmentDoc = new Department_Doc({
        documentID: documentID_new,
        departmentID: departID
      });
      const respS = await DepartmentDoc.save();
      departmentResp.push(respS);
    }

    const respNotifications = [];
    if (status !== 'pending') {
      const userNotificationList = await User_Document_permissions.findAll({
        where: { documentID: documentID }
      });
      for await (const notifiedUser of userNotificationList) {
        const obj = {
          documentID: documentID_new,
          submittingUserID: userID,
          receivingUserID: notifiedUser.userID,
          description: description
        };
        const resp = await notifyByDocState(obj);
        respNotifications.push(resp);
      }
    }

    const respObj = {
      saveResp,
      editUsersResp,
      consultUsersResp,
      departmentResp,
      respCommit,
      respNotifications
    };
    res.status(200).json({
      status: 201,
      message: 'Document saved!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Document not saved!',
      data: {
        error
      }
    });
  }
});

exports.updateDoc = async (req, res, next) => {
  const documentID = req.params.docID;
  let {
    userID,
    status: newStatus,
    description,
    is_public,
    is_external,
    approving_userID,
    editUsersList,
    consultUsersList,
    departmentList
  } = req.body;
  const oldDocumentIndex = await Document_Index.findByPk(documentID);
  const oldDocCommit = await Commit.findOne({
    where: { documentID_new: documentID },
    order: [['created_on', 'DESC']]
  });

  try {
    if (newStatus === 'approved') {
      if (oldDocumentIndex !== null && oldDocumentIndex.status === 'approved') {
        oldDocumentIndex.status = 'obsolete';
        await oldDocumentIndex.save();
      }
    }
    let respUpdateDocState;
    let respEditUsersList;
    let respConsultUsersList;
    let respDepartmentList;
    const updateObj = {
      newStatus,
      description,
      is_public,
      is_external,
      approving_userID
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
      console.log(consultUsersList.length);

      if (
        oldDocumentIndex.approving_userID !== null &&
        oldDocumentIndex.approving_userID !== oldDocCommit.userID
      )
        consultUsersList.push(oldDocumentIndex.approving_userID);
      console.log(consultUsersList);

      if (consultUsersList.length > 0)
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

    const respNotifications = [];
    if (newStatus !== 'pending') {
      const userNotificationList = await User_Document_permissions.findAll({
        where: { documentID: documentID }
      });

      for await (const notifiedUser of userNotificationList) {
        const obj = {
          documentID: documentID,
          submittingUserID: userID,
          receivingUserID: notifiedUser.userID,
          description: description
        };
        const resp = await notifyByDocState(obj);
        respNotifications.push(resp);
      }
    }

    const respObj = {
      respUpdateDocState,
      respEditUsersList,
      respConsultUsersList,
      respDepartmentList,
      respNotifications
    };
    res.status(200).json({
      status: 201,
      message: 'Document updated!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Document not updated!',
      data: {
        error
      }
    });
  }
};

exports.getDocByState = catchAsync(async (req, res, next) => {
  const { userID, docState } = req.params;
});

exports.documentOfficeLocation = catchAsync();
