const { Op } = require('sequelize');

const Commit = require('../models/Commits_Alteration_History');
const Document_Index = require('../models/Document_Index');
const User_Info = require('../models/User_Info');

exports.getCommits2 = async (req, res, next) => {
  try {
    const { documentID_new } = req.query;
    // options contains { userID, documentID_old, documentID_new, status }
    const commit = await Commit.findOne({
      // where: { [Op.or]: { ...options } }
      where: { documentID_new: documentID_new }
    });

    // const co
    const temp = [];
    const commits = [];
    commits.push({ ...commit.dataValues });
    // let previousCommitNew;
    // let previousCommitOld = { ...commit.dataValues };
    // console.log(previousCommitOld);

    // while (previousCommitOld.documentID_old !== null) {
    //   previousCommitNew = await Commit.findOne({
    //     where: { documentID_new: previousCommitOld.documentID_old }
    //   });
    //   console.log('previousCommitNew', previousCommitNew.dataValues);

    //   commits.push(previousCommitNew.dataValues);
    //   if (previousCommitNew.dataValues.documentID_old === null) return;
    //   previousCommitOld = await Commit.findOne({
    //     where: { documentID_old: previousCommitNew.documentID_old }
    //   });
    //   console.log('previousCommitOld', previousCommitOld.dataValues);
    //   commits.push(previousCommitOld.dataValues);
    //   if (previousCommitNew.dataValues.documentID_old === null) return;
    // }

    let previousCommit = { ...commit.dataValues };
    // console.log(previousCommit);

    while (previousCommit.documentID_old !== null) {
      previousCommit = await Commit.findOne({
        where: { documentID_new: previousCommit.documentID_old }
      });
      // console.log('previousCommit', previousCommit.dataValues);
      commits.push(previousCommit.dataValues);
      // if (previousCommit.dataValues.documentID_old === null) return;
    }
    console.log(commits);

    for await (const commitData of commits) {
      const obj = { ...commitData };

      const userData = await User_Info.findByPk(commitData.userID);
      obj.userName = userData.dataValues.name;
      const documentID_newData = await Document_Index.findByPk(
        commitData.documentID_new
      );
      obj.documentID_newName = documentID_newData.dataValues.name;
      if (commitData.documentID_old !== null) {
        const documentID_oldData = await Document_Index.findByPk(
          commitData.documentID_old
        );
        obj.documentID_oldName = documentID_oldData.name;
      }
      if (obj.status === 'forapproval') obj.status = 'For approval';
      if (obj.status === 'approved') obj.status = 'Approved';
      if (obj.status === 'pending') obj.status = 'Pending';
      if (obj.status === 'repproved') obj.status = 'Repproved';
      if (obj.status === 'obsolete') obj.status = 'Obsolete';
      temp.push(obj);
    }

    const respObj = { commits: temp };
    res.status(201).json({
      status: 201,
      message: 'Commits found!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Commits not found!',
      data: {
        error
      }
    });
  }
};

exports.getCommits = async (req, res, next) => {
  try {
    const { documentID_new } = req.query;
    const commits = await Commit.findAll({
      where: {
        [Op.or]: {
          documentID_new: documentID_new,
          documentID_old: documentID_new
        }
      }
    });

    console.log(commits);
    const temp = [];
    for await (const commitData of commits) {
      const obj = { ...commitData.dataValues };

      const userData = await User_Info.findByPk(commitData.userID);
      obj.userName = userData.dataValues.name;
      const documentID_newData = await Document_Index.findByPk(
        commitData.documentID_new
      );
      obj.documentID_newName = documentID_newData.dataValues.name;
      if (commitData.documentID_old !== null) {
        const documentID_oldData = await Document_Index.findByPk(
          commitData.documentID_old
        );
        obj.documentID_oldName = documentID_oldData.name;
      }
      if (obj.status === 'forapproval') obj.status = 'For approval';
      if (obj.status === 'approved') obj.status = 'Approved';
      if (obj.status === 'pending') obj.status = 'Pending';
      if (obj.status === 'repproved') obj.status = 'Repproved';
      if (obj.status === 'obsolete') obj.status = 'Obsolete';
      temp.push(obj);
    }

    const respObj = { commits: temp };
    res.status(201).json({
      status: 201,
      message: 'Commits found!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Commits not found!',
      data: {
        error
      }
    });
  }
};
