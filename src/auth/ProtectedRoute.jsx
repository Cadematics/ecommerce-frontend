import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) {
    return <Loader />;
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected routes
  return <Outlet />;
};

export default ProtectedRoute;
