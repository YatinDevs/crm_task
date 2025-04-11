const express = require("express");
const employeeController = require("../controllers/employeeController");
const { authenticate } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");
const router = express.Router();

// admin can be registered through postman -------> checked
// admin can login through auth login point -------> checked
// admin can create employee -------> checked
// admin can create employee and has authenticate access or not -------> checked
// admin or Hr can create employee  -------> checked
router.post(
  "/create-employee",
  authenticate,
  checkRole(["admin", "hr", "manager"]),
  employeeController.createEmployee
);

router.get(
  "/get-employee",
  authenticate,
  //   checkRole(["admin", "hr", "manager"]),
  employeeController.getAllEmployee
);

router.get("/employees/:id", employeeController.getEmployeeById);
router.put("/employees/:id", employeeController.updateEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);
module.exports = router;
