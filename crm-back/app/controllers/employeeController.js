const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const Employee = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

// only admin or hr can create employees
exports.createEmployee = async (req, res) => {
  try {
    console.log(req.body, `here`);

    const {
      username,
      email,
      password,
      role,
      phone,
      alternate_phone,
      designation,
      department,
      dob,
      joining_date,
      probation_end_date,
      training_end_date,
      increment_date,
      anniversary_date,
      address,
      blood_group,
      reference_contacts,
      attachments,
    } = req.body;
    console.log(username, email, password, role);

    const exisitingEmployee = await Employee.findOne({ where: { email } });
    if (exisitingEmployee) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      username,
      email,
      password: hashedPassword,
      role: role,
      phone,
      alternate_phone,
      designation,
      department,
      dob,
      joining_date,
      probation_end_date,
      training_end_date,
      increment_date,
      anniversary_date,
      address,
      blood_group,
      reference_contacts,
      attachments,
    });

    res.status(201).json({
      message: "Employee Onboarded successfully",
      employeeDetails: employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllEmployee = async (req, res) => {
  try {
    console.log(req.body);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Employee.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      status: 200,
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      status: 500,
      error: error.message,
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    await employee.update(req.body);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    await employee.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// // Get tasks assigned to an employee
// exports.getEmployeeTasks = async (req, res) => {
//   try {
//     const tasks = await Task.findAll({ where: { assigned_to: req.params.id } });
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get attendance records for an employee
// exports.getEmployeeAttendance = async (req, res) => {
//   try {
//     const attendance = await Attendance.findAll({
//       where: { employee_id: req.params.id },
//     });
//     res.status(200).json(attendance);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get leave requests for an employee
// exports.getEmployeeLeaveRequests = async (req, res) => {
//   try {
//     const leaveRequests = await LeaveRequest.findAll({
//       where: { employee_id: req.params.id },
//     });
//     res.status(200).json(leaveRequests);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
