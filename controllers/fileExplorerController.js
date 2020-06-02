const dirTree = require('directory-tree');
const tree = dirTree('./FileStorage');

exports.getFilesTree = (req, res, next) => {
  console.log(tree);

  res.json(tree);
};
