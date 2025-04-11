require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan"); // logger
const cors = require("cors");

// db setup
const sequelize = require("./utils/db");

// Model Define - Table Define
const Employee = require("./models/employeeModel");
const Token = require("./models/tokenModel");

const models = { Employee, Token };

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});
// backend app server defined
const app = express();

// CORS policy
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "*"],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(morgan("dev"));
app.use(express.json()); // body parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); // Handle all routes CORS at once
//
// app.get("/test", (req, res) => {
//   res.send("Hello, World!");
// });

// Routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/emp", employeeRoutes);

// http://localhost:8088/test
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Models have been synchronized with the database.");

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log(`Server is Running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
