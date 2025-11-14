import { createContext, useContext, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { useTicket } from "../hooks/useTicket";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeToCart,
    clearCart,
  } = useCart();

  // ✅ Memoizamos ticket: solo se recalcula cuando cambia el cart o clearCart
  const ticket = useTicket(cart, clearCart);

  // ✅ Memoizamos el value completo del contexto
  const value = useMemo(
    () => ({
      cart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeToCart,
      clearCart,
      ticket,
    }),
    [
      cart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeToCart,
      clearCart,
      ticket,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook de consumo
// eslint-disable-next-line react-refresh/only-export-components
export const useCartContext = () => useContext(CartContext);
