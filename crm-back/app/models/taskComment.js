const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const TaskComment = sequelize.define(
  "TaskComment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "TaskComments",
    timestamps: true,
  }
);

module.exports = TaskComment;
