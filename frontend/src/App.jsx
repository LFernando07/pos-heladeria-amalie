import { BrowserRouter, Routes, Route } from "react-router";
import { WrapperProducts } from "./components/products/WrapperProducts";
import { NuevoProducto } from "./components/products/NuevoProducto";

import DashboardLayout from "./components/shared/DashboardLayout"; // <-- Nuevo Layout
import ProductManagement from "./components/dashboard/ProductManagement"; // <-- Nueva página
import CategoryManagement from "./components/dashboard/CategoryManagement"; // <-- Nueva página
import SalesManagement from "./components/dashboard/SalesManagement"; // <-- Nueva página
import ReportsManagement from "./components/dashboard/reportsManagement"; // <-- Nueva página
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WrapperProducts />} />

        {/* Rutas del Dashboard
        estos cambios fueron realizados para que se reconozcan las rutas para el DASHBOARD */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* La página por defecto del dashboard será la de productos */}
          <Route index element={<ProductManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/new" element={<NuevoProducto />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="sales" element={<SalesManagement />} />
          <Route path="reports" element={<ReportsManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
