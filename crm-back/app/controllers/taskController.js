const Task = require("../models/taskModel");
const Employee = require("../models/employeeModel");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      employeeId: req.user.id, // Assuming authenticated user
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const where = {};
    const { date, status, clientName, employeeId, team } = req.query;

    if (date) where.date = date;
    if (status) where.status = status;
    if (clientName) where.clientName = clientName;
    if (employeeId) where.employeeId = employeeId;

    const include = [];
    if (team) {
      include.push({
        model: Employee,
        where: { department: team },
      });
    }

    const tasks = await Task.findAll({ where, include });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDailyReport = async (req, res) => {
  try {
    const { date = new Date().toISOString().split("T")[0], team } = req.query;

    const where = { date };
    const include = [
      {
        model: Employee,
        attributes: ["id", "username", "department"],
      },
    ];

    if (team) {
      include[0].where = { department: team };
    }

    const tasks = await Task.findAll({ where, include });

    // Format report based on team/department
    const report = tasks.map((task) => {
      const base = {
        id: task.id,
        date: task.date,
        taskType: task.taskType,
        description: task.description,
        clientName: task.clientName,
        status: task.status,
        followUpRequired: task.followUpRequired,
        remarks: task.remarks,
        employee: task.Employee.username,
        department: task.Employee.department,
      };

      // Add department-specific fields
      switch (task.Employee.department) {
        case "designer":
          return {
            ...base,
            postTopic: task.postTopic,
            postType: task.postType,
            designStatus: task.designStatus,
            timeSpent: task.timeSpent,
            fileName: task.fileName,
            sharedWith: task.sharedWith,
          };
        case "developer_team":
          return {
            ...base,
            moduleName: task.moduleName,
            timeSpent: task.timeSpent,
          };
        // Add other departments...
      }
    });

    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
