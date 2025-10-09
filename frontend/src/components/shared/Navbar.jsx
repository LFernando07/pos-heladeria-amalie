import { useState } from 'react';
import './Navbar.css';

export default function Navbar({ onCategoryChange }) {
  const categorias = [
    'Todos los productos',
    'Comida',
    'Postres',
    'Botanas',
    'Soda Italiana',
    'Frappés',
    'Malteadas',
    'Helados',
  ];

  const [active, setActive] = useState('Todos los productos');

  const handleClick = (cat) => {
    setActive(cat);
    onCategoryChange(cat);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {categorias.map((cat) => (
          <li key={cat}>
            <button
              className={`cat-btn ${active === cat ? 'active' : ''}`}
              onClick={() => handleClick(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
