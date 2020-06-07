const express = require('express');
const sequelize = require('./util/database');
const multer = require('multer');

const app = express();

const isAuth = require('./middleware/isAuth');
const isExternal = require('./middleware/isExternal');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departRoutes = require('./routes/departRoutes');
const fileExplorerRoutes = require('./routes/fileExplorerRoutes');
const docRoutes = require('./routes/docRoutes');
const commitRoutes = require('./routes/commitRoutes');
const docLocationRoutes = require('./routes/docLocationRoutes');
// const homeRoutes = require('./routes/homeRoutes');

sequelize.sync();

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
app.use(
  multer({
    storage: fileStorage,
    // fileFilter: fileFilter
  }).single('fileMulter')
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', isExternal, authRoutes);
app.use('/depart', isExternal, departRoutes);
app.use('/user', isExternal, userRoutes);
app.use('/filexplorer', isExternal, fileExplorerRoutes);
app.use('/docs', isExternal, docRoutes);
app.use('/commits', isExternal, commitRoutes);
app.use('/docLocation', isExternal, docLocationRoutes);
// app.use('/home', isExternal, homeRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ status: status, message: message, data: data });
});

const serve = app.listen(8080);
// usar o serve para socket.io
