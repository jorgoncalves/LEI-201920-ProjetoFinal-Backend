const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User_Auth = sequelize.define(
<<<<<<< HEAD
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
    password: { type: Sequelize.STRING, allowNull: false },
    is_active: { type: Sequelize.BOOLEAN, allowNull: false },
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
=======
  'user_auth',
  {
    userID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    is_active: { type: Sequelize.BOOLEAN, allowNull: false },
  },
  { timestamp: false }
>>>>>>> 1cd514a1279c980616dd3aeb8d1fbcd0ce411ce1
);

module.exports = User_Auth;
