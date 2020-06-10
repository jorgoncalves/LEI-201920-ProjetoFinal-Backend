const multer = require('multer');
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `FileStorage/temp`);
  },
  filename: (req, file, cb) => {
    // cb(null, Date.now() + '_' + file.originalname);
    cb(null, file.originalname);
  },
});

module.exports = multer({
  storage: fileStorage,
  // fileFilter: fileFilter
}).array('fileArrMulter');
