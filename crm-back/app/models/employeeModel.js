const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Task = require("./taskModel");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        "employee",
        "admin",
        "developer_team",
        "hr",
        "social_media",
        "designer",
        "sales",
        "support",
        "accounts",
        "manager"
      ),
      defaultValue: "employee",
    },
    department: {
      type: DataTypes.ENUM(
        "Development Team",
        "HR Team",
        "SMM Team",
        "Designer Team",
        "Sales Team",
        "Support Team",
        "Accounts Team",
        "Manager"
      ),
    },
    phone: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: true,
    },
    alternate_phone: {
      type: DataTypes.STRING(15),
    },
    designation: {
      type: DataTypes.STRING(50),
    },
    dob: {
      type: DataTypes.DATE,
    },
    joining_date: {
      type: DataTypes.DATE,
    },
    probation_end_date: {
      type: DataTypes.DATE,
    },
    training_end_date: {
      type: DataTypes.DATE,
    },
    increment_date: {
      type: DataTypes.DATE,
    },
    anniversary_date: {
      type: DataTypes.DATE,
    },
    address: {
      type: DataTypes.TEXT,
    },
    blood_group: {
      type: DataTypes.STRING(5),
    },
    reference_contacts: {
      type: DataTypes.JSONB,
    },
    attachments: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "Employees",
    timestamps: true,
  }
);

module.exports = Employee;
