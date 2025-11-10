import { memo, useMemo, useCallback } from "react";
import { Link, NavLink } from "react-router";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = memo(() => {
  const { logout } = useAuth();

  // Memoriza los ítems para evitar recreación del arreglo en cada render
  const items = useMemo(
    () => [
      { name: "Punto de Venta", url: "/" },
      { name: "Productos", url: "/dashboard/products" },
      { name: "Categorías", url: "/dashboard/categories" },
      { name: "Ventas", url: "/dashboard/sales" },
      { name: "Reportes", url: "/dashboard/reports" },
    ],
    []
  );

  // Memoriza logoutHandler para no crear una nueva función en cada render
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Dashboard Amelie</h3>
      </div>

      <nav className="sidebar-nav">
        {items.map(({ name, url }) => (
          <NavLink
            to={url}
            key={url}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            end={url === "/"} // Evita que "/" esté activo junto con rutas hijas
          >
            {name}
          </NavLink>
        ))}

        <Link to="/login" className="sidebar-link" onClick={handleLogout}>
          Cerrar Sesión
        </Link>
      </nav>
    </aside>
  );
});
