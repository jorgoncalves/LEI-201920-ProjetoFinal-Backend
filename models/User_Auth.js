const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User_Auth = sequelize.define(
  "user_auth",
  {
    userID: {
      type: Sequelize.UUID,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    is_admin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: "0" },
    password: { type: Sequelize.STRING, allowNull: false },
    is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: "1" },
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

module.exports = User_Auth;
