const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'postgres://hnztfhcn:AFhZ8pcb4uBd6cP32B4CA9jDk6lbgV9y@kandula.db.elephantsql.com:5432/hnztfhcn',
  {
    logging: false,
    timezone: 'gmt'
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
