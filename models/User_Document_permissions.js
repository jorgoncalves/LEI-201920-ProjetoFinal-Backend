const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const User_Info = require("./User_Info");
const Document_index = require("./Document_Index");

const User_Document_permissions = sequelize.define(
  "user_document_permissions",
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userID: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: User_Info,
        key: "userID",
      },
    },
    documentID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Document_index,
        key: "documentID",
      },
    },
    type_access: { type: Sequelize.INTEGER, allowNull: false, defaultValue: "2" },
    has_ext_access: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: "0" },
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

module.exports = User_Document_permissions;
