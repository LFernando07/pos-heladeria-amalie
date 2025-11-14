import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../shared/Loader";

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user || user.rol !== "admin") return <Navigate to="/" />;

  return children;
};
