import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import RoleSidebar from "../components/RoleSidebar/RoleSidebar";
// Layout/Layout.jsx
function Layout() {
  const location = useLocation();
  const isAuthPage = ["/", "/signup", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!isAuthPage && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {!isAuthPage && <RoleSidebar />}
        <main
          className={`flex-1 overflow-auto ${
            !isAuthPage ? "md:ml-64 pt-14" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
