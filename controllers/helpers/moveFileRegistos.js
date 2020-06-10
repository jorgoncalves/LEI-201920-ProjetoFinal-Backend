const path = require('path');
const fs = require('fs');

exports.moveFileRegistos = async (recordID, docName, filesArr) => {
  const pathArr = [];
  for (const file of filesArr) {
    const currentPath = path.join(`FileStorage`, `temp`, `${file.filename}`);
    let newPath = path.join(
      `FileStorage`,
      `${docName}`,
      `Registos`,
      `${recordID}`,
      `${file.filename}`
    );
    const dir = path.join(`FileStorage`, `${docName}`);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      const v = path.join(`FileStorage`, `${docName}`, `Registos`);
      fs.mkdirSync(v);
      const p = path.join(
        `FileStorage`,
        `${docName}`,
        `Registos`,
        `${recordID}`
      );
      fs.mkdirSync(p);
    } else {
      const existingDir = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      if (!existingDir.includes('Registos')) {
        const v = path.join(`FileStorage`, `${docName}`, `Registos`);
        fs.mkdirSync(v);
        const p = path.join(
          `FileStorage`,
          `${docName}`,
          `Registos`,
          `${recordID}`
        );
        fs.mkdirSync(p);
      } else {
        const recordPath = path.join(`FileStorage`, `${docName}`, `Registos`);
        const existingDirRecord = fs
          .readdirSync(recordPath, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);
        if (!existingDirRecord.includes(`${recordID}`)) {
          const p = path.join(
            `FileStorage`,
            `${docName}`,
            `Registos`,
            `${recordID}`
          );
          fs.mkdirSync(p);
        }
      }
    }
    fs.renameSync(currentPath, newPath);
    pathArr.push({ name: file.filename, path: newPath });
  }
  return pathArr;
};
