const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const User_Info = require("./User_Info");

const Department = sequelize.define(
  "department",
  {
    departmentID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    chief_userID: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: User_Info,
        key: "userID",
      },
    },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
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

module.exports = Department;
