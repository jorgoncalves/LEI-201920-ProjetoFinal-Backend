const express = require('express');
const sequelize = require('./util/database');
const fs = require('fs');
const multer = require('multer');
const https = require('https');

const app = express();

const isAuth = require('./middleware/isAuth');
const isExternal = require('./middleware/isExternal');
const multerSingleFile = require('./middleware/multer/multerSingleFile');
const multerMultipleFiles = require('./middleware/multer/multerMultipleFiles');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departRoutes = require('./routes/departRoutes');
const fileExplorerRoutes = require('./routes/fileExplorerRoutes');
const docRoutes = require('./routes/docRoutes');
const commitRoutes = require('./routes/commitRoutes');
const docLocationRoutes = require('./routes/docLocationRoutes');
const registerRoutes = require('./routes/registerRoutes');
// const homeRoutes = require('./routes/homeRoutes');

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

sequelize.sync();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
    'Authorization'
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send('Hello world');
});
app.use('/auth', isExternal, authRoutes);
app.use('/depart', isExternal, departRoutes);
app.use('/user', isExternal, userRoutes);
app.use('/filexplorer', isExternal, fileExplorerRoutes);
app.use('/docs', isExternal, multerSingleFile, docRoutes);
app.use('/commits', isExternal, commitRoutes);
app.use('/docLocation', isExternal, docLocationRoutes);
app.use('/registers', isExternal, multerMultipleFiles, registerRoutes);
// app.use('/home', isExternal, homeRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ status: status, message: message, data: data });
});
const serve = app.listen(8080);
// https.createServer({ key: privateKey, cert: certificate }, app).listen(8080);
console.log('Connected ate ' + new Date().toLocaleString());
