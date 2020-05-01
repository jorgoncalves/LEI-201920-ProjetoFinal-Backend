const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User_Auth = sequelize.define(
  'user_auth',
  {
    userID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    is_active: { type: Sequelize.BOOLEAN, allowNull: false },
  },
  { timestamp: false }
);

module.exports = User_Auth;
