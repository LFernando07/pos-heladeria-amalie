import { useCallback, useMemo, useState, memo } from "react";
import { useFlavours } from "../../hooks/useFlavours";
import "./Tipos.css";

export const Tipos = memo(({ productoBase, onClose, onAddToCart }) => {
  const { sabores: tiposData } = useFlavours(productoBase.categoria_id);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [conCobertura, setConCobertura] = useState(false);

  const selectedNombres = useMemo(
    () => new Set(tiposSeleccionados.map((s) => s.nombre)),
    [tiposSeleccionados]
  );

  const toggleTipo = useCallback((tipo) => {
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
  }, []);

  const handleAgregarHelado = useCallback(() => {
    if (tiposSeleccionados.length === 0) {
      alert("Por favor, selecciona al menos un sabor.");
      return;
    }

    const precioCobertura = conCobertura ? 5 : 0;
    const nombreTipos = tiposSeleccionados.map((s) => s.nombre).join(", ");
    const nombreFinal = `${productoBase.nombre} (${nombreTipos})${
      conCobertura ? " con cobertura" : ""
    }`;

    const productoFinal = {
      ...productoBase,
      nombre: nombreFinal,
      precio: productoBase.precio + precioCobertura,
      id: Date.now(),
    };

    onAddToCart(productoFinal);
    onClose();
  }, [conCobertura, productoBase, tiposSeleccionados, onAddToCart, onClose]);

  const isChecked = useCallback(
    (nombreTipo) => selectedNombres.has(nombreTipo),
    [selectedNombres]
  );

  const tipos = useMemo(() => tiposData, [tiposData]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tipo-container" onClick={(e) => e.stopPropagation()}>
        <div className="titulo">
          Elige los sabores para tu {productoBase.nombre}
        </div>

        <div className="tipo-grid">
          {tipos.map((tipo) => (
            <div
              key={tipo.nombre}
              className={`tipo-card ${
                isChecked(tipo.nombre) ? "selected" : ""
              }`}
              onClick={() => toggleTipo(tipo)}
            >
              <img src={tipo.imagen} alt={tipo.nombre} />
              <div className="nombre">{tipo.nombre}</div>
              {tipo.precio > 0 && <div className="precio">+${tipo.precio}</div>}
              <input
                type="checkbox"
                checked={isChecked(tipo.nombre)}
                readOnly
              />
            </div>
          ))}
        </div>

        {productoBase.categoria === "Helados" && (
          <label className="opcion">
            <span className="opcion-label">Cobertura de chocolate </span>
            <input
              type="checkbox"
              checked={conCobertura}
              onChange={() => setConCobertura(!conCobertura)}
            />
            <div className="toggle-switch">
              <span className="slider"></span>
            </div>
          </label>
        )}

        <div className="actions">
          <button className="back-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="flavours-sucess" onClick={handleAgregarHelado}>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
});
