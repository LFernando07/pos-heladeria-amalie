import { useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([]); // El carrito empieza vacío

  // --- LÓGICA DEL CARRITO MODIFICADA ---

  const addToCart = (productoAAgregar) => {
    setCart((prevCarrito) => {
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
  const increaseQuantity = (idProducto) => {
    setCart((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === idProducto ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // --- NUEVA FUNCIÓN PARA DECREMENTAR CANTIDAD ---
  const decreaseQuantity = (idProducto) => {
    setCart((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id === idProducto
      );

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

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };
};
