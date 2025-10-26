import { Link } from "react-router"; // 1. Importa Link para la navegación
import { FaRegSun } from "react-icons/fa"; // Importa un icono
import "./Header.css";

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Heladería Amelie</h1>
      <div className="btn-go-dash">
        <Link to="/dashboard/products" className="add-product-link">
          <FaRegSun />
        </Link>
      </div>
    </header>
  );
};
