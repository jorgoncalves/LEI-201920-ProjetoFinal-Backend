const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const User_Info = require('./User_Info');

const Document_Index = sequelize.define(
  'document_index',
  {
    documentID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    path: { type: Sequelize.TEXT, allowNull: true },
    file_extension: { type: Sequelize.STRING, allowNull: false },
    isModelFile: { type: Sequelize.BOOLEAN, allowNull: false },
    has_records: { type: Sequelize.BOOLEAN, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false },
    approving_userID: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: User_Info,
        key: 'userID',
      },
    },
    description: { type: Sequelize.TEXT, allowNull: true },
    is_public: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: '0' },
    is_external: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: '0',
    },
    size: { type: Sequelize.INTEGER, allowNull: false },
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

module.exports = Document_Index;
