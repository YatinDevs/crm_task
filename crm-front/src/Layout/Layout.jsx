import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import RoleSidebar from "../components/RoleSidebar/RoleSidebar";
function Layout() {
  const location = useLocation();
  //   console.log(location);
  const isLogin =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {!isLogin && <Navbar />}
      <div className="flex h-[100vh]  ">
        <div>
          {/* Sidebar */}
          {!isLogin && <RoleSidebar />}
        </div>

        {/* Main Content */}
        <div className="flex-1  bg-gray-100 ">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
