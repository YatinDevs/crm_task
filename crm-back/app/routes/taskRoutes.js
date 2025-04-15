const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticate } = require("../middlewares/authMiddleware");

// Task routes
router.post("/", authenticate, taskController.createTask); // done tested //http://localhost:8088/api/v1/task
router.post("/self", authenticate, taskController.createSelfTask); // done tested //http://localhost:8088/api/v1/task
router.get("/my-tasks", authenticate, taskController.getEmployeeTasks); // done tested
router.get("/department", authenticate, taskController.getDepartmentTasks); // done tested

router.post("/daily-update", authenticate, taskController.addDailyUpdate);
router.put("/status", authenticate, taskController.updateTaskStatus);
router.post("/comment", authenticate, taskController.addComment);
router.get("/:taskId", authenticate, taskController.getTaskDetails);
router.post(
  "/reports/department",
  authenticate,
  taskController.getDepartmentReports
);

module.exports = router;
