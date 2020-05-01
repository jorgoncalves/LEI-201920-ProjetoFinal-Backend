const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'postgres://hnztfhcn:AFhZ8pcb4uBd6cP32B4CA9jDk6lbgV9y@kandula.db.elephantsql.com:5432/hnztfhcn',
  {
    logging: false,
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
      timezone: 'Europe/Lisbon',
    },
    timezone: 'Europe/Lisbon',
  }
);

module.exports = sequelize;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
