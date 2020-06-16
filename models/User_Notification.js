const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const User_Info = require('./User_Info');
const Document_Index = require('./Document_Index');

const User_Notification = sequelize.define(
  'User_Notification',
  {
    notificationID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    receivingUserID: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: User_Info,
        key: 'userID'
      }
    },
    submittingUserID: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: User_Info,
        key: 'userID'
      }
    },
    documentID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Document_Index,
        key: 'documentID'
      }
    },
    description: { type: Sequelize.TEXT, allowNull: true },
    was_seen: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    created_on: {
      type: 'TIMESTAMP WITHOUT TIME ZONE',
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_on: {
      type: 'TIMESTAMP WITHOUT TIME ZONE',
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: false
  }
);

module.exports = User_Notification;
