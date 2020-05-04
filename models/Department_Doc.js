const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Document_Index = require("./Document_Index");
const Department = require("./Department");

const Department_Doc = sequelize.define(
  "department_doc",
  {
    ID: {
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
    departmentID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Department,
        key: "departmentID",
      },
    },
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

module.exports = Department_Doc;
