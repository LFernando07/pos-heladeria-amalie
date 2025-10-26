import "./ProductCard.css";

// Recibimos el objeto 'producto' completo en lugar de props separadas
export default function ProductCard({ producto, onBuy }) {
  // Usamos una imagen por defecto si el producto no tiene una
  const imagenProducto = producto.imagen || "./images/placeholder.png";
  return (
    <div className="product-card" onClick={() => onBuy(producto)}>
      <div className="image-container">
        <img
          src={imagenProducto}
          alt={producto.nombre}
          className="product-image"
        />
      </div>
      <p style={{ opacity: 0.6, margin: 0 }}>{producto.categoria}</p>
      <h4 className="plan-name">{producto.nombre}</h4>
      {/*  Ahora pasamos el objeto 'producto' entero a la función onBuy */}
      <button>${producto.precio}</button>
    </div>
  );
}
