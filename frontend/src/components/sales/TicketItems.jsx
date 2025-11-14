import { memo, useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import { useCartContext } from "../../context/CartContext";

export const TicketItems = memo(() => {
  const { cart, increaseQuantity, decreaseQuantity, removeToCart } =
    useCartContext();

  const handleIncrease = useCallback(
    (id) => increaseQuantity(id),
    [increaseQuantity]
  );

  const handleDecrease = useCallback(
    (id) => decreaseQuantity(id),
    [decreaseQuantity]
  );

  const handleRemove = useCallback((id) => removeToCart(id), [removeToCart]);

  if (cart.length === 0)
    return <p className="empty-ticket-message">No hay productos en la orden</p>;

  return (
    <div className="items">
      <div className="items-header">
        <span className="product-col">PRODUCTO</span>
        <span className="quantity-col">CANTIDAD</span>
        <span className="subtotal-col">SUBTOTAL</span>
        <span className="action-col"></span>
      </div>

      {cart.map((product) => (
        <div className="item" key={product.id}>
          <span className="product-col">{product.nombre}</span>

          <div className="quantity-col quantity-control">
            <button onClick={() => handleDecrease(product.id)}>-</button>
            <span>{product.cantidad}</span>
            <button onClick={() => handleIncrease(product.id)}>+</button>
          </div>

          <span className="subtotal-col">
            ${(product.precio * product.cantidad).toFixed(2)}
          </span>

          <span className="action-col" onClick={() => handleRemove(product.id)}>
            <FaTrash />
          </span>
        </div>
      ))}
    </div>
  );
});
