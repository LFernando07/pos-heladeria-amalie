import { memo, useCallback } from "react";
import { useCategories } from "../../context/CategoryContext";
import "./Navbar.css";

export const Navbar = memo(({ onCategoryChange }) => {
  const { categories, active, setActive } = useCategories();
  const ALL = "Todos los productos";

  // Memoriza la función para evitar recreaciones innecesarias
  const handleClick = useCallback(
    (cat) => {
      setActive(cat);
      onCategoryChange?.(cat);
    },
    [setActive, onCategoryChange]
  );

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <button
            type="button"
            className={`cat-btn ${active === ALL ? "active" : ""}`}
            onClick={() => handleClick(ALL)}
          >
            {ALL}
          </button>
        </li>

        {categories.map(({ id, nombre }) => (
          <li key={id}>
            <button
              type="button"
              className={`cat-btn ${active === nombre ? "active" : ""}`}
              onClick={() => handleClick(nombre)}
            >
              {nombre}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
});
