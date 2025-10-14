import { FaTrash } from "react-icons/fa";
export const TicketItems = ({ items, onIncrement, onDecrement, onRemove }) => (
  <div className="items">
    <div className="items-header">
      <span className="product-col">PRODUCTO</span>
      <span className="quantity-col">CANTIDAD</span>
      <span className="subtotal-col">SUBTOTAL</span>
      <span className="action-col"></span>
    </div>
    {items.length === 0 ? (
      <p className="empty-ticket-message">No hay productos en la orden</p>
    ) : (
      items.map((product) => (
        <div className="item" key={product.id}>
          <span className="product-col">{product.nombre}</span>
          <div className="quantity-col quantity-control">
            <button onClick={() => onDecrement(product.id)}>-</button>
            <span>{product.cantidad}</span>
            <button onClick={() => onIncrement(product.id)}>+</button>
          </div>
          <span className="subtotal-col">
            ${(product.precio * product.cantidad).toFixed(2)}
          </span>
          <span className="action-col" onClick={() => onRemove(product.id)}>
            <FaTrash />
          </span>
        </div>
      ))
    )}
  </div>
);
