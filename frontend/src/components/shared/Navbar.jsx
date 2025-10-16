import { useCategories } from "../../hooks/useCategories";
import "./Navbar.css";

export const Navbar = ({ onCategoryChange }) => {
  const { categories, active, setActive } = useCategories();
  const all = "Todos los productos";

  const handleClick = (cat) => {
    setActive(cat);
    onCategoryChange(cat);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <button
            className={`cat-btn ${active === all ? "active" : ""}`}
            onClick={() => handleClick(all)}
          >
            {all}
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              className={`cat-btn ${active === cat.nombre ? "active" : ""}`}
              onClick={() => handleClick(cat.nombre)}
            >
              {cat.nombre}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
