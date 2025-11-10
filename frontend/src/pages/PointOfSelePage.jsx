import { useState, useCallback, useMemo } from "react";
import { Header } from "../components/shared/Header";
import { Navbar } from "../components/shared/Navbar";
import { ProductList } from "../components/products/ProductList";
import { Ticket } from "../components/sales/Ticket";
import { Tipos } from "../components/orders/Tipos";
import { useProducts } from "../context/ProductsContext";
import { useCartContext } from "../context/CartContext";

export const PointOfSalePage = () => {
  const { setCategoria, products } = useProducts();
  const { addToCart } = useCartContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // ✅ Función memoizada: evitar recreación innecesaria
  const handleCompra = useCallback(
    (producto) => {
      if (producto.requiere_sabor === 1) {
        setProductoSeleccionado(producto);
        setModalVisible(true);
      } else {
        addToCart(producto);
      }
    },
    [addToCart]
  );

  // ✅ También memoizada (se pasa a Tipos como prop)
  const handleCerrarModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // ✅ Memoriza la clase principal para evitar recalculación
  const appClassName = useMemo(
    () => `app ${modalVisible ? "modal-abierto" : ""}`,
    [modalVisible]
  );

  return (
    <div className={appClassName}>
      {/* Header + Navbar fijos */}
      <div className="sticky-header-nav">
        <Header />
        <Navbar onCategoryChange={setCategoria} />
      </div>

      <main className="content">
        <ProductList productos={products} onAdd={handleCompra} />
        <Ticket />
      </main>

      {modalVisible && (
        <Tipos
          productoBase={productoSeleccionado}
          onClose={handleCerrarModal}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};
