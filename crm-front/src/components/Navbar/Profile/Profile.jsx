// components/Profile/Profile.jsx
import React from "react";
import { Dropdown } from "antd";
import { LogOut, User } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import { NavLink } from "react-router-dom";

function Profile() {
  const { employee, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const items = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: <NavLink to="/dashboard/profile">My Profile</NavLink>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div className="flex items-center cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2">
          {employee?.username?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:inline">{employee?.username}</span>
      </div>
    </Dropdown>
  );
}

export default Profile;
