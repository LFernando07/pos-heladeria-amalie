import { useState } from "react";
import "./Tipos.css";

const tiposData = [
  { nombre: "Fresa", precio: 0, imagen: "/images/sabores/fresa.jpg" },
  { nombre: "Chocolate", precio: 0, imagen: "/images/sabores/chocolate.jpg" },
  { nombre: "Vainilla", precio: 0, imagen: "/images/sabores/vainilla.jpg" },
  { nombre: "Nuez", precio: 0, imagen: "/images/sabores/nuez.jpg" },
  { nombre: "Yogurt", precio: 0, imagen: "/images/sabores/yogurt.jpg" },
  { nombre: "Limón", precio: 0, imagen: "/images/sabores/limon.jpg" },
  { nombre: "Mango", precio: 0, imagen: "/images/sabores/mango.jpg" },
  { nombre: "Uva", precio: 0, imagen: "/images/sabores/uva.jpg" },
  { nombre: "Galleta Oreo", precio: 0, imagen: "/images/sabores/oreo.jpg" },
  { nombre: "Chicle", precio: 0, imagen: "/images/sabores/chicle.jpg" },
];

export default function Tipos({ heladoBase, onClose, onAddToCart }) {
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [conCobertura, setConCobertura] = useState(false);

  const toggleTipo = (tipo) => {
    setTiposSeleccionados((prev) => {
      if (prev.find((s) => s.nombre === tipo.nombre)) {
        return prev.filter((s) => s.nombre !== tipo.nombre);
      } else {
        if (prev.length >= 2) {
          alert("Solo puedes elegir un máximo de 2 sabores 🍨");
          return prev;
        }
        return [...prev, tipo];
      }
    });
  };

  const handleAgregarHelado = () => {
    if (tiposSeleccionados.length === 0) {
      alert("Por favor, selecciona al menos un sabor.");
      return;
    }

    const precioExtra = tiposSeleccionados.reduce(
      (total, s) => total + s.precio,
      0
    );
    const precioCobertura = conCobertura ? 5 : 0; // Asumimos un precio para la cobertura
    const nombreTipos = tiposSeleccionados.map((s) => s.nombre).join(", ");
    const nombreFinal = `${heladoBase.nombre} (${nombreTipos})${
      conCobertura ? " con cobertura" : ""
    }`;

    const productoFinal = {
      ...heladoBase,
      nombre: nombreFinal,
      precio: heladoBase.precio + precioExtra + precioCobertura,
      id: Date.now(),
    };

    onAddToCart(productoFinal);
    onClose();
  };

  const isChecked = (nombreTipo) => {
    return tiposSeleccionados.some((s) => s.nombre === nombreTipo);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tipo-container" onClick={(e) => e.stopPropagation()}>
        <div className="titulo">
          Elige los sabores para tu {heladoBase.nombre}
        </div>

        <div className="tipo-grid">
          {tiposData.map((tipo) => (
            // div completo ahora es clickeable
            // y se le aplica la clase 'selected' dinámicamente.
            <div
              key={tipo.nombre}
              className={`tipo-card ${
                isChecked(tipo.nombre) ? "selected" : ""
              }`}
              onClick={() => toggleTipo(tipo)}
            >
              <img
                src={tipo.imagen || "./images/placeholder.png"}
                alt={tipo.nombre}
              />
              <div className="nombre">{tipo.nombre}</div>
              {tipo.precio > 0 && <div className="precio">+${tipo.precio}</div>}
              {/* Dejamos el input oculto por accesibilidad, pero ya no controla el click */}
              <input
                type="checkbox"
                checked={isChecked(tipo.nombre)}
                readOnly
              />
            </div>
          ))}
        </div>

        {/*estructura para el interruptor de cobertura */}
        <label className="opcion">
          <span className="opcion-label">Cobertura de chocolate </span>
          {/* El input está oculto, pero la etiqueta lo activa */}
          <input
            type="checkbox"
            checked={conCobertura}
            onChange={() => setConCobertura(!conCobertura)}
          />
          <div className="toggle-switch">
            <span className="slider"></span>
          </div>
        </label>

        <div className="actions">
          <button className="back-button" onClick={onClose}>
            Cancelar
          </button>
          <button onClick={handleAgregarHelado}>Agregar al Carrito</button>
        </div>
      </div>
    </div>
  );
}
