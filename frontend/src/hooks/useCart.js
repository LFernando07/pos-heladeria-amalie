import { useState, useCallback, useMemo } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([]);

  // 🧠 Memoizamos todas las funciones para evitar recrearlas en cada render
  const addToCart = useCallback((productoAAgregar) => {
    setCart((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id === productoAAgregar.id
      );

      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id === productoAAgregar.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prevCarrito, { ...productoAAgregar, cantidad: 1 }];
    });
  }, []);

  const increaseQuantity = useCallback((idProducto) => {
    setCart((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === idProducto ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((idProducto) => {
    setCart((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id === idProducto
      );

      if (productoExistente && productoExistente.cantidad === 1) {
        return prevCarrito.filter((item) => item.id !== idProducto);
      }

      return prevCarrito.map((item) =>
        item.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item
      );
    });
  }, []);

  const removeToCart = useCallback((productId) => {
    setCart((prevCarrito) =>
      prevCarrito.filter((item) => item.id !== productId)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ✅ Devolvemos un objeto memoizado, para que su referencia no cambie
  return useMemo(
    () => ({
      cart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeToCart,
      clearCart,
    }),
    [
      cart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeToCart,
      clearCart,
    ]
  );
};
