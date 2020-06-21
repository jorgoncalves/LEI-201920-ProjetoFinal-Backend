const fs = require('fs');
const pathJoin = require('path');
const dirTree = require('directory-tree');
const tree = dirTree('./FileStorage');

exports.getFilesTree = (req, res, next) => {
  res.json(tree);
};

exports.getFile = async (req, res, next) => {
  try {
    console.log(req.query);

    let { path } = req.query;
    path = pathJoin.join.apply(null, path.split('\\'));
    const file = fs.readFileSync(path);
    // res.setHeader('Contet-Disposition', 'attachment; filename=12354');

    res.download(path);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
