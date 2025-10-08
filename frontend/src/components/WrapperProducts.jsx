import { useState, useEffect } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Ticket from "./Ticket";
import ProductList from "./ProductList";
import Tipos from "./Tipos"
import "./App.css";

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
  const [productosBase, setProductosBase] = useState([]);
  const [categoria, setCategoria] = useState("Todos los productos");
  const [carrito, setCarrito] = useState([]); // El carrito empieza vacío
  const [modalVisible, setModalVisible] = useState(false);
  const [heladoSeleccionado, setHeladoSeleccionado] = useState(null);

  useEffect(() => { //aqui se hace la peticion al servidor para obtener los productos al iniciar la app
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/productos');
        if (!response.ok) {
          throw new Error('NO se pudo conectar con el servidor.');
        }
        const result = await response.json();
        setProductosBase(result.data);
      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        alert("No se pudo cargar el catálogo de productos. Revisar si el servidor está corriendo.");
      }
    };

    fetchProducts();
  }, []);//solo se realiza una vez

  const productos =
    categoria === "Todos los productos"
      ? productosBase
      : productosBase.filter((p) => p.categoria === categoria);

  // --- LÓGICA DEL CARRITO MODIFICADA ---

  const agregarAlCarrito = (productoAAgregar) => {
    setCarrito((prevCarrito) => {
      // 1. Revisa si el producto ya existe en el carrito
      const productoExistente = prevCarrito.find(
        (item) => item.id === productoAAgregar.id
      );

      // 2. Si existe, incrementa su cantidad
      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id === productoAAgregar.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      // 3. Si no existe, lo agrega al carrito con cantidad 1
      return [...prevCarrito, { ...productoAAgregar, cantidad: 1 }];
    });
  };

  // --- NUEVA FUNCIÓN PARA INCREMENTAR CANTIDAD ---
  const incrementarCantidad = (idProducto) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === idProducto ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // --- NUEVA FUNCIÓN PARA DECREMENTAR CANTIDAD ---
  const decrementarCantidad = (idProducto) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((item) => item.id === idProducto);

      // Si la cantidad es 1, al decrementar se elimina el producto del carrito
      if (productoExistente && productoExistente.cantidad === 1) {
        return prevCarrito.filter((item) => item.id !== idProducto);
      }

      // Si no, solo se reduce la cantidad en 1
      return prevCarrito.map((item) =>
        item.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item
      );
    });
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  // --- Lógica del modal (no cambia) ---
  const handleCompra = (producto) => {
    const productosDirectos = ["Cono grande vainilla", "Cono grande de chocolate", "Sándwich"];
    if (producto.categoria === "Helados" && !productosDirectos.includes(producto.nombre)) {
      setHeladoSeleccionado(producto);
      setModalVisible(true);
    } else {
      agregarAlCarrito(producto);
    }
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
  };

  return (
  <div className={`app ${modalVisible ? 'modal-abierto' : ''}`}>
    
    {/*  ESTE ES EL CAMBIO: Agrupa Header y Navbar en un div */}
    <div className="sticky-header-nav">
      <Header />
      <Navbar onCategoryChange={setCategoria} />
    </div>

    <main className="content">
      <ProductList productos={productos} onAdd={handleCompra} />
      <Ticket
        items={carrito}
        onClear={limpiarCarrito}
        onIncrement={incrementarCantidad}
        onDecrement={decrementarCantidad}
      />
    </main>

      {modalVisible && (
        <Tipos
          heladoBase={heladoSeleccionado}
          onClose={handleCerrarModal}
          onAddToCart={agregarAlCarrito} // agregarAlCarrito ya agrupa, así que funciona bien aquí
        />
      )}
    </div>
  );
}