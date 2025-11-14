import { memo, useMemo } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

export const ProductList = memo(({ productos, onAdd }) => {
  // ✅ Memoriza la lista renderizada
  const renderedProducts = useMemo(
    () =>
      productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} onBuy={onAdd} />
      )),
    [productos, onAdd]
  );

  return <div className="product-list">{renderedProducts}</div>;
});
