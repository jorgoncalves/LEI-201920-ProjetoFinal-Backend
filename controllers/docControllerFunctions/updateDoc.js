const User_Document_permissions = require('../../models/User_Document_permissions');
const Document_Index = require('../../models/Document_Index');
const Department_Doc = require('../../models/Department_Doc');
const User_Notification = require('../../models/User_Notification');

exports.updateDocState = (documentID, updateObj) => {
  const {
    newStatus,
    description,
    is_public,
    is_external,
    approving_userID
  } = updateObj;
  return new Promise(async (resolve, reject) => {
    try {
      const document = await Document_Index.findByPk(documentID);
      if (newStatus) document.status = newStatus;
      if (description) document.description = description;
      //atenção que por serem Boolean requerem uma lógica diferente
      if (is_public) document.is_public = is_public === 'true' ? true : false;
      if (is_external)
        document.is_external = is_external === 'true' ? true : false;
      if (approving_userID) document.approving_userID = approving_userID;
      const saveResp = await document.save();
      resolve(saveResp);
    } catch (error) {
      reject(error);
    }
  });
};

exports.notifyByDocState = (obj) => {
  const {
    documentID,
    submittingUserID,
    receivingUserID,
    description,
    was_seen = false
  } = obj;
  return new Promise(async (resolve, reject) => {
    try {
      const newNotification = new User_Notification({
        documentID,
        submittingUserID,
        receivingUserID,
        description,
        was_seen
      });
      const saveResp = await newNotification.save();
      resolve(saveResp);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateUserDocPermissions = (documentID, type_access, list) => {
  //list deve de sempre conter todos!
  console.log('updateUserDocPermissions');

  console.log('documentID', documentID);
  console.log('type_access', type_access);
  console.log('list', list);

  return new Promise(async (resolve, reject) => {
    try {
      const oldPermissions = await User_Document_permissions.findAll({
        where: { documentID, type_access }
      });
      const deleteOldPermissions = await User_Document_permissions.destroy({
        where: { documentID: documentID, type_access }
      });
      const respSave = [];

      for await (const userID of list) {
        const UserDocPermission = new User_Document_permissions({
          documentID: documentID,
          userID: userID,
          type_access: type_access
          // has_ext_access: 0,
        });
        const respS = await UserDocPermission.save();
        respSave.push(respS);
      }
      resolve(respSave);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateDepartmentDoc = async (documentID, list) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Department_Doc.destroy({ where: { documentID } });
      const respSave = [];

      for await (const departmentID of list) {
        const departmentDoc = new Department_Doc({
          documentID,
          departmentID
        });
        const respS = await departmentDoc.save();
        respSave.push(respS);
      }
      resolve(respSave);
    } catch (error) {
      reject(error);
    }
  });
};
