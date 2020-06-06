const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const User_Info = require('./User_Info');
const Document_index = require('./Document_Index');

const Commits_Alteration_History = sequelize.define(
  'commits',
  {
    commitID: {
      type: Sequelize.UUID,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    userID: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: User_Info,
        key: 'userID',
      },
    },
    documentID_old: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Document_index,
        key: 'documentID',
      },
    },
    documentID_new: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Document_index,
        key: 'documentID',
      },
    },
    status: { type: Sequelize.STRING, allowNull: false },
    created_on: {
      type: 'TIMESTAMP WITHOUT TIME ZONE',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Commits_Alteration_History;
