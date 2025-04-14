const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const DailyUpdate = sequelize.define(
  "DailyUpdate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    update: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hoursWorked: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "DailyUpdates",
    timestamps: true,
  }
);

module.exports = DailyUpdate;
