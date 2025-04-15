// src/routes/adminRoutes.js
import TaskReports from "../components/Tasks/TaskReports";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddEmployee from "../pages/ManageEmp/AddEmployee";
import EmployeeList from "../pages/ManageEmp/EmployeeList";
import CreateTask from "../pages/Tasks/CreateTask";
import DailyReport from "../pages/Tasks/DailyReport";
import Performance from "../pages/Tasks/Performance";
import TaskList from "../pages/Tasks/TaskList";

const adminRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard/employees/add", component: AddEmployee },
  { path: "/dashboard/employees/list", component: EmployeeList },
  { path: "/dashboard/employees/performance", component: Performance },
  { path: "/dashboard/tasks/create", component: CreateTask },
  { path: "/dashboard/tasks/list", component: TaskList },
  { path: "/dashboard/tasks/reports", component: TaskReports },
  { path: "/dashboard/tasks/daily-updates", component: DailyReport },
  //   { path: "/dashboard/attendance", component: <Attendance /> },
  //   { path: "/dashboard/reports", component: <Reports /> },
];

export default adminRoutes;
