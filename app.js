const express = require('express');
const sequelize = require('./util/database');
const requestIp = require('request-ip');

const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const isAuth = require('./middleware/isAuth');
const departRoutes = require('./routes/departRoutes');
// const homeRoutes = require('./routes/homeRoutes');

sequelize.sync();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  req.clientIp = clientIp;
  next();
});

app.use('/auth', authRoutes);
app.use('/depart', departRoutes);
app.use('/user', userRoutes);
// app.use('/home', isAuth,homeRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ status: status, message: message, data: data });
});

const serve = app.listen(8080);
// usar o serve para socket.io
