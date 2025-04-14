const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const TaskAttachment = sequelize.define(
  "TaskAttachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "TaskAttachments",
    timestamps: true,
  }
);

module.exports = TaskAttachment;
