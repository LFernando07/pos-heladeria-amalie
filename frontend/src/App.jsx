import { Routes, Route, MemoryRouter } from "react-router";
import { Suspense, lazy } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { NuevoProducto } from "./components/products/NuevoProducto";
import { PointOfSalePage } from "./pages/PointOfSelePage";
import { CategoriesProvider } from "./context/CategoryContext";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { Loader } from "./components/shared/Loader";
import UsersManagement from "./components/dashboard/UsersManagement";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

// --- Lazy imports (carga bajo demanda) ---
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProductManagement = lazy(() =>
  import("./components/dashboard/ProductManagement")
);
const CategoryManagement = lazy(() =>
  import("./components/dashboard/CategoryManagement")
);
const SalesManagement = lazy(() =>
  import("./components/dashboard/SalesManagement")
);
const ReportsManagement = lazy(() =>
  import("./components/dashboard/reportsManagement")
);

export default function App() {
  return (
    <MemoryRouter>
      <AuthProvider>
        <ProductsProvider>
          <CategoriesProvider>
            {/* Suspense muestra algo mientras los componentes cargan */}
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />

                {/* Ruta principal protegida */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <CartProvider>
                        <PointOfSalePage />
                      </CartProvider>
                    </ProtectedRoute>
                  }
                />

                {/* Rutas del Dashboard (todas protegidas) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<ProductManagement />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="products/new" element={<NuevoProducto />} />

                  <Route
                    path="users"
                    element={
                      <AdminRoute>
                        <UsersManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="users/new"
                    element={
                      <AdminRoute>
                        <RegisterPage />
                      </AdminRoute>
                    }
                  />

                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="sales" element={<SalesManagement />} />
                  <Route path="reports" element={<ReportsManagement />} />
                </Route>
              </Routes>
            </Suspense>
          </CategoriesProvider>
        </ProductsProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
