import ProductCard from "./ProductCard";
import "./ProductList.css";

export default function ProductList({ productos, onAdd }) {
  return (
    <div className="product-list">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto} // 👈 Pasamos el objeto completo
          onBuy={onAdd}
        />
      ))}
    </div>
  );
}