import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { message } from "antd";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { employee, isAuthenticated, checkAuth } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
        setAuthChecked(true);
      } catch (error) {
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, [checkAuth]);

  if (!authChecked) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    message.warning("Please login to access this page");
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0 && !roles.includes(employee?.role)) {
    message.warning("You don't have permission to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
