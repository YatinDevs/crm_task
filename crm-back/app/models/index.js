const Employee = require("./employeeModel");
const Task = require("./taskModel");
const DailyUpdate = require("./dailyUpdate");
const TaskComment = require("./taskComment");
const TaskAttachment = require("./taskAttachment");
// Employee model
Employee.hasMany(Task, { foreignKey: "assignedTo", as: "assignedTasks" });
Employee.hasMany(Task, { foreignKey: "assignedBy", as: "createdTasks" });
Employee.hasMany(DailyUpdate, { foreignKey: "employeeId", as: "dailyUpdates" });
Employee.hasMany(TaskComment, { foreignKey: "employeeId", as: "taskComments" });

// Task model
Task.belongsTo(Employee, { foreignKey: "assignedTo", as: "assignee" });
Task.belongsTo(Employee, { foreignKey: "assignedBy", as: "assigner" });
Task.hasMany(DailyUpdate, { foreignKey: "taskId", as: "dailyUpdates" });
Task.hasMany(TaskComment, { foreignKey: "taskId", as: "taskComments" });
Task.hasMany(TaskAttachment, { foreignKey: "taskId", as: "taskAttachments" });

// DailyUpdate model
DailyUpdate.belongsTo(Task, { foreignKey: "taskId", as: "task" });
DailyUpdate.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

// TaskComment model
TaskComment.belongsTo(Task, { foreignKey: "taskId", as: "task" });
TaskComment.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

// TaskAttachment model
TaskAttachment.belongsTo(Task, { foreignKey: "taskId", as: "task" });

module.exports = {
  Employee,
  Task,
  DailyUpdate,
  TaskComment,
  TaskAttachment,
};
