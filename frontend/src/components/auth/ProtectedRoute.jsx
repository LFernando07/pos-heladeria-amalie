import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../shared/Loader";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mientras carga /me no rediriges todavía
  if (loading) {
    return <Loader />;
  }

  // Si no hay usuario autenticado ➜ Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, renderiza el componente hijo
  return children;
};
