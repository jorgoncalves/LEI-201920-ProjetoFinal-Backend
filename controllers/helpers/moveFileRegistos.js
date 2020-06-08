const path = require('path');
const fs = require('fs');

exports.moveFileRegistos = async (name, filename) => {
  const currentPath = path.join(`FileStorage`, `temp`, `${filename}`);
  let newPath = path.join(`FileStorage`, `${name}`, `Registos`, `${filename}`);
  const dir = path.join(`FileStorage`, `${name}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    const v = path.join(`FileStorage`, `${name}`, `Registos`);
    fs.mkdirSync(v);
  } else {
    const existingDir = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    if (!existingDir.includes('Registos')) {
      const v = path.join(`FileStorage`, `${name}`, `Registos`);
      fs.mkdirSync(v);
    }
  }
  fs.renameSync(currentPath, newPath);
  return newPath;
};
