import { memo } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";
import "./DashboardLayout.css";

// ✅ Memo evita renderizados innecesarios si no cambian las props
const DashboardPage = memo(() => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      {/* Panel derecho: encabezado + contenido dinámico */}
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
});

export default DashboardPage;
