const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    taskType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Not Started",
        "In Progress",
        "Completed",
        "Blocked",
        "On Hold"
      ),
      defaultValue: "Not Started",
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    remarks: DataTypes.TEXT,

    // Role-specific fields (nullable for other roles)
    postTopic: DataTypes.STRING,
    postType: DataTypes.STRING,
    designStatus: DataTypes.STRING,
    timeSpent: DataTypes.FLOAT,
    fileName: DataTypes.STRING,
    sharedWith: DataTypes.STRING,
    language: DataTypes.STRING,
    submittedTo: DataTypes.STRING,
    moduleName: DataTypes.STRING,
    platform: DataTypes.STRING,
    timePosted: DataTypes.TIME,
    scheduledDate: DataTypes.DATE,
    postLink: DataTypes.STRING,
    campaignName: DataTypes.STRING,
    toolUsed: DataTypes.STRING,
    totalCalls: DataTypes.INTEGER,
    responses: DataTypes.INTEGER,

    // Relationships
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Employees",
        key: "id",
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Projects",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["date"] },
      { fields: ["employeeId"] },
      { fields: ["clientName"] },
      { fields: ["status"] },
    ],
  }
);

Task.associate = (models) => {
  Task.belongsTo(models.Employee, { foreignKey: "employeeId" });
  Task.belongsTo(models.Project, { foreignKey: "projectId" });
};
module.exports = Task;
