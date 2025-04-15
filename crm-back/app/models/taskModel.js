const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "in-progress",
        "completed",
        "review",
        "approved",
        "rejected"
      ),
      defaultValue: "pending",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
    },
    actualHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Tasks",
    timestamps: true,
  }
);

module.exports = Task;
