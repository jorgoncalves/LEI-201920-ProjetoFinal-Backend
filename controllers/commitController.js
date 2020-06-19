const Commit = require('../models/Commits_Alteration_History');
const Document_Index = require('../models/Document_Index');
const User_Info = require('../models/User_Info');

exports.getCommits = async (req, res, next) => {
  try {
    const options = req.params;
    // options contains { userID, documentID_old, documentID_new, status }
    const commits = await Commit.findAll({
      where: { ...options }
    });

    const temp = [];

    for await (const commit of commits) {
      const obj = { ...commit.dataValues };

      const userData = await User_Info.findByPk(commit.userID);
      obj.userName = userData.dataValues.name;
      const documentID_newData = await Document_Index.findByPk(
        commit.dataValues.documentID_new
      );
      obj.documentID_newName = documentID_newData.dataValues.name;
      if (commit.documentID_old !== null) {
        const documentID_oldData = await Document_Index.findByPk(
          commit.documentID_old
        );
        obj.documentID_oldName = documentID_oldData.name;
      }
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
