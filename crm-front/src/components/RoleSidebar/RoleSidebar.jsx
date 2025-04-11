// components/RoleSidebar/RoleSidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getSidebarItems } from "../../utils/sidebarConfig";
import {
  Home,
  Users,
  ClipboardList,
  ClipboardCheck,
  User,
  Banknote,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  X,
  Menu as MenuIcon,
} from "lucide-react";

function RoleSidebar() {
  const { employee } = useAuthStore();
  const role = employee?.role || "employee";
  const menu = getSidebarItems(role);
  const [openMenus, setOpenMenus] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const shouldShowMenuItem = (item) => true;

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <div className="mt-18 hidden md:flex flex-col w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menu.filter(shouldShowMenuItem).map((item, index) => (
              <li key={index} className="p-2 rounded">
                {item.subMenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(index)}
                      className="flex items-center justify-between w-full p-2 rounded text-sm md:text-md hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {openMenus[index] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {openMenus[index] && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.subMenu
                          .filter(shouldShowMenuItem)
                          .map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <NavLink
                                to={subItem.link}
                                className={({ isActive }) =>
                                  `block p-2 text-sm rounded ${
                                    isActive
                                      ? "bg-gray-700"
                                      : "hover:bg-gray-800"
                                  }`
                                }
                              >
                                {subItem.label}
                              </NavLink>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-2 rounded text-sm md:text-md ${
                        isActive ? "bg-gray-700" : "hover:bg-gray-800"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>

          {/* Sidebar Content */}
          <div className="relative w-64 h-full bg-gray-900 text-white">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="font-medium">
                    {employee?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{employee?.username}</p>
                  <p className="text-xs text-gray-400 capitalize">{role}</p>
                </div>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
              <ul className="space-y-2">
                {menu.filter(shouldShowMenuItem).map((item, index) => (
                  <li key={index} className="p-2 rounded">
                    {item.subMenu ? (
                      <div>
                        <button
                          onClick={() => toggleMenu(index)}
                          className="flex items-center justify-between w-full p-2 rounded text-sm hover:bg-gray-800"
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                          {openMenus[index] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {openMenus[index] && (
                          <ul className="ml-6 mt-1 space-y-1">
                            {item.subMenu
                              .filter(shouldShowMenuItem)
                              .map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <NavLink
                                    to={subItem.link}
                                    className={({ isActive }) =>
                                      `block p-2 text-sm rounded ${
                                        isActive
                                          ? "bg-gray-700"
                                          : "hover:bg-gray-800"
                                      }`
                                    }
                                    onClick={() => setMobileSidebarOpen(false)}
                                  >
                                    {subItem.label}
                                  </NavLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={item.link}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 p-2 rounded text-sm ${
                            isActive ? "bg-gray-700" : "hover:bg-gray-800"
                          }`
                        }
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RoleSidebar;
