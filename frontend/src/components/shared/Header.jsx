import { Link } from "react-router"; // 1. Importa Link para la navegación
import { FaPlusCircle } from "react-icons/fa"; // Importa un icono
import "./Header.css";

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Heladería Amelie</h1>
      {/* <Link to="/NuevoProducto" className="add-product-link">
        <FaPlusCircle />
        <span>Agregar Producto</span>
      </Link> */}
    </header>
  );
};
