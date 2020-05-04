const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const User_Info = require("./User_Info");
const Department = require("./Department");

const Department_User = sequelize.define(
  "department_user",
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
    departmentID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Department,
        key: "departmentID",
      },
    },
    is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: "1" },
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

module.exports = Department_User;
