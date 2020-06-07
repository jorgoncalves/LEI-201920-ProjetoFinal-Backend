const Commit = require('../models/Commits_Alteration_History');

exports.getCommits = async (req, res, next) => {
  try {
    const options = req.body;
    // options contains { userID, documentID_old, documentID_new, status }
    const commits = await Commit.findAll({
      where: { ...options },
    });
    const respObj = { commits };
    res.status(201).json({
      status: 201,
      message: 'Commits found!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Commits not found!',
      data: {
        error,
      },
    });
  }
};
