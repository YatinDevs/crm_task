const jwt = require("jsonwebtoken");

const generateAccessToken = (employee) => {
  return jwt.sign(
    { id: employee.id, role: employee.role, department: employee.department },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (employee) => {
  return jwt.sign(
    { id: employee.id, role: employee.role, department: employee.department },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
