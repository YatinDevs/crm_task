const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("../models/tokenModel");
const Employee = require("../models/employeeModel");
const {
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/tokenUtils");

// User Signup flow
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const exisitingEmployee = await Employee.findOne({ where: { email } });
    if (exisitingEmployee) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log(req.body);
    const accessToken = generateAccessToken(employee);
    const refreshToken = generateRefreshToken(employee);

    await Token.create({
      employeeId: employee.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    console.log(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(accessToken);

    res.status(201).json({
      message: "User created and logged in successfully",
      accessToken: accessToken,
      employeeDetails: employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login flow
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const employee = await Employee.findOne({ where: { email } });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Account not found. Please check your email or sign up.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      employee?.dataValues?.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid password. Please try again.",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(employee);
    const refreshToken = generateRefreshToken(employee);

    // Invalidate old refresh tokens
    await Token.destroy({ where: { employeeId: employee.id } });

    // Store new refresh token
    await Token.create({
      employeeId: employee.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful! Redirecting...",
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).json({ error: "No refresh token provided" });

    await Token.destroy({ where: { token: refreshToken } });

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(401).json({ error: "No refresh token provided" });

    const tokenData = await Token.findOne({ where: { token: refreshToken } });
    if (!tokenData || tokenData.expiresAt < new Date())
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });

    const employee = await Employee.findByPk(tokenData.employeeId);
    if (!employee) {
      return res.status(401).json({ error: "Employee not found" });
    }

    const newAccessToken = generateAccessToken(employee);
    const newRefreshToken = generateRefreshToken(employee);

    await Token.destroy({ where: { token: refreshToken } }); // Rotate refresh token
    await Token.create({
      employeeId: employee.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmp = async (req, res) => {
  try {
    console.log(req.body);
    const { accessToken } = req.cookies;
    // console.log(em);
    if (!accessToken)
      return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const employee = await Employee.findByPk(decoded.id, {
      attributes: ["id", "username", "email", "role", "department"],
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json({ employee });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
