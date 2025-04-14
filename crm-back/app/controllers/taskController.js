const Task = require("../models/taskModel");
const DailyUpdate = require("../models/dailyUpdate");
const TaskComment = require("../models/taskComment");
const TaskAttachment = require("../models/taskAttachment");
const Employee = require("../models/employeeModel");

const { Op } = require("sequelize");
// Create a task assigned to the authenticated user
exports.createSelfTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, estimatedHours } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo: req.user.id, // Assign to the authenticated user
      assignedBy: req.user.id, // Created by the same user
      dueDate,
      priority,
      estimatedHours,
      department: req.user.department,
    });

    res.status(201).json({
      success: true,
      message: "Task created and assigned to self successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      estimatedHours,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      dueDate,
      priority,
      estimatedHours,
      department: req.user.department,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all tasks for an employee
exports.getEmployeeTasks = async (req, res) => {
  try {
    console.log(req.user);
    const tasks = await Task.findAll({
      where: { assignedTo: req.user.id },
      include: [
        {
          model: Employee,
          as: "assigner",
          attributes: ["id", "username", "email"],
        },
        { model: DailyUpdate, order: [["createdAt", "DESC"]] },
      ],
      order: [["dueDate", "ASC"]],
    });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get tasks by department (for managers)
exports.getDepartmentTasks = async (req, res) => {
  try {
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    const tasks = await Task.findAll({
      where: { department: req.user.department },
      include: [
        {
          model: Employee,
          as: "assignee",
          attributes: ["id", "username", "email"],
        },
        {
          model: Employee,
          as: "assigner",
          attributes: ["id", "username", "email"],
        },
        { model: DailyUpdate, order: [["createdAt", "DESC"]] },
      ],
      order: [["dueDate", "ASC"]],
    });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add daily update to a task
exports.addDailyUpdate = async (req, res) => {
  try {
    console.log(req.user);
    const { taskId, update, hoursWorked, status } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    if (task.assignedTo !== req.employee.id) {
      return res.status(403).json({
        success: false,
        error: "You can only update your own tasks",
      });
    }

    const dailyUpdate = await DailyUpdate.create({
      taskId,
      employeeId: req.employee.id,
      update,
      hoursWorked,
      status: status || task.status,
    });

    // Update task's actual hours and status if provided
    const updateData = {
      actualHours: task.actualHours + parseFloat(hoursWorked),
    };

    if (status) {
      updateData.status = status;
    }

    await task.update(updateData);

    res.status(201).json({
      success: true,
      message: "Daily update added successfully",
      dailyUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if the employee is assigned to the task or is a manager/admin
    if (
      task.assignedTo !== req.employee.id &&
      !["manager", "admin"].includes(req.employee.role)
    ) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to update this task",
      });
    }

    await task.update({ status });

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add comment to a task
exports.addComment = async (req, res) => {
  try {
    const { taskId, comment } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const taskComment = await TaskComment.create({
      taskId,
      employeeId: req.employee.id,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      taskComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get task details with updates and comments
exports.getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Employee,
          as: "assignee",
          attributes: ["id", "username", "email"],
        },
        {
          model: Employee,
          as: "assigner",
          attributes: ["id", "username", "email"],
        },
        {
          model: DailyUpdate,
          include: [{ model: Employee, attributes: ["id", "username"] }],
        },
        {
          model: TaskComment,
          include: [{ model: Employee, attributes: ["id", "username"] }],
        },
        { model: TaskAttachment },
      ],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if the employee is assigned to the task or is a manager/admin
    if (
      task.assignedTo !== req.employee.id &&
      !["manager", "admin"].includes(req.employee.role)
    ) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to view this task",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get department task reports (for managers)
exports.getDepartmentReports = async (req, res) => {
  try {
    if (!["manager", "admin"].includes(req.employee.role)) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    const tasks = await Task.findAll({
      where: { department: req.employee.department },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn("SUM", sequelize.col("estimatedHours")),
          "totalEstimatedHours",
        ],
        [sequelize.fn("SUM", sequelize.col("actualHours")), "totalActualHours"],
      ],
      group: ["status"],
    });

    const employees = await Employee.findAll({
      where: { department: req.employee.department },
      attributes: ["id", "username"],
      include: [
        {
          model: Task,
          as: "assignedTasks",
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "taskCount"],
            [
              sequelize.fn("SUM", sequelize.col("estimatedHours")),
              "totalEstimated",
            ],
            [sequelize.fn("SUM", sequelize.col("actualHours")), "totalActual"],
          ],
        },
      ],
      group: ["Employee.id"],
    });

    res.status(200).json({
      success: true,
      report: {
        statusSummary: tasks,
        employeePerformance: employees,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
