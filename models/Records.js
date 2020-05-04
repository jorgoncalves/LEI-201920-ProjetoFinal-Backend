const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const User_Info = require("./User_Info");
const Document_Index = require("./Document_Index");

const Records = sequelize.define(
  "records",
  {
    recordID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    documentID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Document_Index,
        key: "documentID",
      },
    },
    submitted_by_UserID: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: User_Info,
        key: "userID",
      },
    },
    path: { type: Sequelize.TEXT, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    created_on: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Records;
