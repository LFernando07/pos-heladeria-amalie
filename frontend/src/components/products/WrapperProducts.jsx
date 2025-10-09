import { useState } from "react";
import Header from "../shared/Header";
import Navbar from "../shared/Navbar";
import Ticket from "../sales/Ticket";
import ProductList from "./ProductList";
import Tipos from "../orders/Tipos";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCar";

// La lista de productos
/*
const productosBase = [
    { id: 1, nombre: 'Nachos', precio: 35, categoria: 'Comida', imagen: '/images/nachos.png' },
    { id: 2, nombre: 'Maruchan', precio: 20, categoria: 'Comida', imagen: '/images/maruchan.png' },
    { id: 3, nombre: 'Ramen', precio: 60, categoria: 'Comida', imagen: '/images/ramen.png' },
    { id: 4, nombre: 'Dumplings', precio: 80, categoria: 'Comida' },
    { id: 5, nombre: 'Cheesecake', precio: 35, categoria: 'Postres' },
    { id: 6, nombre: 'Galletas con chispas de chocolate', precio: 20, categoria: 'Postres' },
    { id: 7, nombre: 'Muffins', precio: 20, categoria: 'Postres' },
    { id: 8, nombre: 'Papitas', precio: 20, categoria: 'Botanas' },
    { id: 9, nombre: 'Dulces', precio: 15, categoria: 'Botanas' },
    { id: 10, nombre: 'Blueberry', precio: 40, categoria: 'Soda Italiana' },
    { id: 11, nombre: 'Grosella', precio: 40, categoria: 'Soda Italiana' },
    { id: 12, nombre: 'Frambuesa', precio: 40, categoria: 'Soda Italiana' },
    { id: 13, nombre: 'Fresa', precio: 40, categoria: 'Soda Italiana' },
    { id: 14, nombre: 'fruta del dragon', precio: 40, categoria: 'Soda Italiana' },
    { id: 15, nombre: 'Manzana verde', precio: 40, categoria: 'Soda Italiana' },
    { id: 16, nombre: 'Chicle', precio: 40, categoria: 'Soda Italiana' },
    { id: 17, nombre: 'Kiwi', precio: 40, categoria: 'Soda Italiana' },
    { id: 18, nombre: 'Cafe', precio: 40, categoria: 'Frappés' },
    { id: 19, nombre: 'Taro', precio: 40, categoria: 'Frappés' },
    { id: 20, nombre: 'Moka blanco', precio: 40, categoria: 'Frappés' },
    { id: 21, nombre: 'Choco Menta', precio: 40, categoria: 'Frappés' },
    { id: 22, nombre: 'Yogurt griego', precio: 40, categoria: 'Frappés' },
    { id: 23, nombre: 'Chocolate oscuro', precio: 40, categoria: 'Frappés' },
    { id: 24, nombre: 'Carbon activado', precio: 40, categoria: 'Frappés' },
    { id: 25, nombre: 'Fresa', precio: 45, categoria: 'Malteadas' },
    { id: 26, nombre: 'Chocolate', precio: 45, categoria: 'Malteadas' },
    { id: 27, nombre: 'Vainilla', precio: 45, categoria: 'Malteadas' },
    { id: 28, nombre: 'Cono de sensillo', precio: 15, categoria: 'Helados' },
    { id: 29, nombre: 'Cono de sabor', precio: 18, categoria: 'Helados' },
    { id: 30, nombre: 'Cono grande vainilla', precio: 30, categoria: 'Helados', imagen: '/images/conograndevainilla.png' },
    { id: 31, nombre: 'Cono grande de chocolate', precio: 35, categoria: 'Helados', imagen: '/images/conograndechocolate.png' },
    { id: 32, nombre: 'Vaso chico', precio: 15, categoria: 'Helados' },
    { id: 33, nombre: 'Vaso grande', precio: 40, categoria: 'Helados' },
    { id: 34, nombre: 'Sandwitch', precio: 15, categoria: 'Helados' },
    { id: 35, nombre: 'Mini hot cakes 12 pz', precio: 25, categoria: 'Postres' },
    { id: 36, nombre: 'Mini hot cakes 18 pz', precio: 35, categoria: 'Postres' },
];
*/
export default function WrapperProducts() {
  const { setCategoria, productos } = useProducts();
  const { cart, addToCart, increaseQuantity, decreaseQuantity, clearCart } =
    useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [heladoSeleccionado, setHeladoSeleccionado] = useState(null);

  // --- Lógica del modal (no cambia) ---
  const handleCompra = (producto) => {
    const productosDirectos = [
      "Cono grande vainilla",
      "Cono grande de chocolate",
      "Sándwich",
    ];
    if (
      producto.categoria === "Helados" &&
      !productosDirectos.includes(producto.nombre)
    ) {
      setHeladoSeleccionado(producto);
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
        />
      </main>

      {modalVisible && (
        <Tipos
          heladoBase={heladoSeleccionado}
          onClose={handleCerrarModal}
          onAddToCart={addToCart} // agregarAlCarrito ya agrupa, así que funciona bien aquí
        />
      )}
    </div>
  );
}
