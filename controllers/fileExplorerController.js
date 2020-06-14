const fs = require('fs');
const dirTree = require('directory-tree');
const tree = dirTree('./FileStorage');

exports.getFilesTree = (req, res, next) => {
  res.json(tree);
};

exports.getFile = async (req, res, next) => {
  try {
    console.log(req.query);

    const { path } = req.query;
    const file = fs.readFileSync(path);
    // res.setHeader('Contet-Disposition', 'attachment; filename=12354');

    res.download(path);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
