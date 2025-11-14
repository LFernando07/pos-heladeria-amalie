import { memo, useCallback } from "react";
import "./ProductCard.css";
import { API_URL } from "../../config/api";

const ProductCard = ({ producto, onBuy }) => {
  const imagenProducto = producto.imagen.substring(
    1,
    producto.imagen.toString().length
  );

  // ✅ useCallback evita recrear la función en cada render
  const handleClick = useCallback(() => {
    onBuy(producto);
  }, [onBuy, producto]);

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="image-container">
        <img
          src={API_URL + imagenProducto}
          alt={producto.nombre}
          className="product-image"
        />
      </div>
      <p style={{ opacity: 0.6, margin: 0 }}>{producto.categoria}</p>
      <h4 className="plan-name">{producto.nombre}</h4>
      <button>${producto.precio}</button>
    </div>
  );
};

// ✅ Evita re-render si `producto` y `onBuy` son iguales entre renders
export default memo(ProductCard);
