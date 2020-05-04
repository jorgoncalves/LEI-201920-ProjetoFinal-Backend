const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const User_Info = require("./User_Info");

const Document_Index = sequelize.define(
  "document_index",
  {
    documentID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    path: { type: Sequelize.TEXT, allowNull: true },
    name: { type: Sequelize.STRING, allowNull: false },
    file_extension: { type: Sequelize.STRING, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    is_public: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: "0" },
    is_external: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: "0" },
    approving_userID: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: User_Info,
        key: "userID",
      },
    },
    created_on: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_on: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Document_Index;
