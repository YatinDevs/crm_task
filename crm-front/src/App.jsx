import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "./Layout/Layout";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import useAuthStore from "./store/authStore";
import AuthRedirect from "./components/AuthRedirect/AuthRedirect";
import PageNotFound from "./pages/ErrorPages/PageNotFound";
import AddEmployee from "./pages/ManageEmp/AddEmployee";
import EmployeeList from "./pages/ManageEmp/EmployeeList";

function App() {
  // http://localhost:5173
  // http://localhost:5173/ - index
  // http://localhost:5173/about  - path about
  // http://localhost:5173/contact  - path contact

  const { checkAuth, employee, isAuthenticated } = useAuthStore();
  console.log(employee);
  console.log(isAuthenticated);
  useEffect(() => {
    checkAuth();
  }, []);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/employees/add"
            element={<AddEmployee />}
          />{" "}
          <Route path="/dashboard/employees/list" element={<EmployeeList />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
