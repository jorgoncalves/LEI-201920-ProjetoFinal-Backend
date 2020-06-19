const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const User_Auth = require('./User_Auth');

const User_Info = sequelize.define(
  'user_info',
  {
    userID: {
      type: Sequelize.UUID,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    name: { type: Sequelize.STRING, allowNull: false },
    country: { type: Sequelize.STRING, allowNull: false },
    country_code: { type: Sequelize.STRING, allowNull: true },
    phone_number: { type: Sequelize.STRING, allowNull: true },
    user_display: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: '{"shortcuts":[],"quickAccess":[]}',
    },
    profile_img_path: { type: Sequelize.STRING, allowNull: true },
    created_on: {
      type: 'TIMESTAMP WITHOUT TIME ZONE',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_on: {
      type: 'TIMESTAMP WITHOUT TIME ZONE',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);

User_Info.hasOne(User_Auth);
User_Auth.belongsTo(User_Info);

module.exports = User_Info;
