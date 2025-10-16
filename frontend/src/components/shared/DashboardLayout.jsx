
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      {/* Contenedor para la parte derecha (header + contenido) */}
      <div className="dashboard-main-panel">
        <header className="dashboard-header">
          <h1>Heladería Amelie</h1>
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;