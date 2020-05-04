const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Record = require("./Records");

const Attachments = sequelize.define(
  "attachments",
  {
    attachmentsID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    recordID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Record,
        key: "recordID",
      },
    },
    path: { type: Sequelize.TEXT, allowNull: true },
    name: { type: Sequelize.STRING, allowNull: false },
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

module.exports = Attachments;
