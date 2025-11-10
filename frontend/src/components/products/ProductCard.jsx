import { memo, useCallback } from "react";
import "./ProductCard.css";

const ProductCard = ({ producto, onBuy }) => {
  const imagenProducto = producto.imagen || "./images/placeholder.png";

  // ✅ useCallback evita recrear la función en cada render
  const handleClick = useCallback(() => {
    onBuy(producto);
  }, [onBuy, producto]);

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="image-container">
        <img
          src={imagenProducto}
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
