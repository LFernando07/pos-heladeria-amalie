import { memo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";
import { FaRegSun } from "react-icons/fa6";

import { FaSignInAlt } from "react-icons/fa";
import "./Header.css";

export const Header = memo(() => {
  const { logout } = useAuth();

  // Memoriza la función para evitar recrearla en cada render
  const handleLogout = useCallback(
    (e) => {
      e.preventDefault();
      logout();
    },
    [logout]
  );

  return (
    <header className="header">
      <h1 className="header-title">Heladería Amelie</h1>

      <div className="header-button-actions">
        <Link
          to="/dashboard/products"
          className="add-product-link"
          title="Dashboard"
        >
          <FaRegSun />
        </Link>

        <button
          className="logout-action"
          onClick={handleLogout}
          title="Cerrar Sesión"
        >
          <FaSignInAlt />
        </button>
      </div>
    </header>
  );
});
