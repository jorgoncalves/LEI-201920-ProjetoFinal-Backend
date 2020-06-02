const dirTree = require('directory-tree');
const tree = dirTree('./FileStorage');

exports.getFilesTree = (req, res, next) => {
  res.json(tree);
};
