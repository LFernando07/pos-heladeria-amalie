import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const items = [
  { name: "Punto de Venta", url: "/" },
  { name: "Productos", url: "/dashboard/products" },
  { name: "Categorías", url: "/dashboard/categories" },
  { name: "Ventas", url: "/dashboard/sales" },
  { name: "Reportes", url: "/dashboard/reports" },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Dashboard Amelie</h3>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            to={item.url}
            key={item.url}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            end={item.url === "/"} // Importante para la ruta raíz
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
