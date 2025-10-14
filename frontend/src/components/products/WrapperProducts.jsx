import { useState } from "react";
import { Header } from "../shared/Header";
import { Navbar } from "../shared/Navbar";

import { ProductList } from "./ProductList";
import { useProducts } from "../../hooks/useProducts";
import { Ticket } from "../sales/Ticket";
import { Tipos } from "../orders/Tipos";
import { useCart } from "../../hooks/useCar";

export const WrapperProducts = () => {
  const { setCategoria, productos } = useProducts();
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeToCart,
    clearCart,
  } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // --- Lógica del modal (no cambia) ---
  const handleCompra = (producto) => {
    if (producto.requiere_sabor === 1) {
      setProductoSeleccionado(producto);
      setModalVisible(true);
    } else {
      addToCart(producto);
    }
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <div className={`app ${modalVisible ? "modal-abierto" : ""}`}>
      {/*  ESTE ES EL CAMBIO: Agrupa Header y Navbar en un div */}
      <div className="sticky-header-nav">
        <Header />
        <Navbar onCategoryChange={setCategoria} />
      </div>

      <main className="content">
        <ProductList productos={productos} onAdd={handleCompra} />
        <Ticket
          items={cart}
          onClear={clearCart}
          onIncrement={increaseQuantity}
          onDecrement={decreaseQuantity}
          onRemove={removeToCart}
        />
      </main>

      {modalVisible && (
        <Tipos
          productoBase={productoSeleccionado}
          onClose={handleCerrarModal}
          onAddToCart={addToCart} // agregarAlCarrito ya agrupa, así que funciona bien aquí
        />
      )}
    </div>
  );
};
