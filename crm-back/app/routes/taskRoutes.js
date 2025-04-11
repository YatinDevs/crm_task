const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");

// Create new task
router.post("/", TaskController.createTask);

// Get tasks with filters
router.get("/", TaskController.getTasks);

// Get task by ID
router.get("/:id", TaskController.getTaskById);

// Update task
router.put("/:id", TaskController.updateTask);

// Delete task
router.delete("/:id", TaskController.deleteTask);

// Daily reports
router.get("/reports/daily", TaskController.getDailyReport);
router.get("/reports/employee/:employeeId", TaskController.getEmployeeReport);
router.get("/reports/client/:clientName", TaskController.getClientReport);
router.get("/reports/team/:team", TaskController.getTeamReport);

module.exports = router;
