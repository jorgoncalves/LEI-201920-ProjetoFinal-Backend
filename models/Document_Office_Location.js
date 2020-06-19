const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Document_index = require('./Document_Index');
const User_Info = require('../models/User_Info');

const Commits_Alteration_History = sequelize.define(
  'document_office_location',
  {
    userID: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: User_Info,
        key: 'userID'
      }
    },
    documentID_new: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Document_index,
        key: 'documentID'
      }
    },
    documentID_old: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Document_index,
        key: 'documentID'
      }
    },
    local: { type: Sequelize.STRING, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false },
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

module.exports = Commits_Alteration_History;
