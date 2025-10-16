import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Dashboard Amelie</h3>
      </div>
      <nav className="sidebar-nav">
        {/* Usamos NavLink para que el link activo se resalte automáticamente */}
        <NavLink to="/">Punto de Venta</NavLink>
        <NavLink to="/dashboard/products">Productos</NavLink>
        <NavLink to="/dashboard/categories">Categorías</NavLink>
        <NavLink to="/dashboard/sales">Ventas</NavLink>
        <NavLink to="/dashboard/reports">Reportes</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;