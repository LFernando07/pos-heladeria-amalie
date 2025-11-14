import { memo, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { FaCashRegister } from "react-icons/fa";
import { useCartContext } from "../../context/CartContext";

export const TicketActions = memo(() => {
  const { ticket } = useCartContext();
  const { handleCancel, handleProcessPayment, loading } = ticket;

  // ✅ Memoriza el texto dinámico del botón
  const payButtonText = useMemo(
    () => (loading ? "PROCESANDO..." : "COBRAR EN EFECTIVO"),
    [loading]
  );

  return (
    <div className="actions">
      <button className="cancel-btn" onClick={handleCancel} disabled={loading}>
        <FaTrash /> CANCELAR ORDEN
      </button>

      <button
        className="pay-btn"
        onClick={handleProcessPayment}
        disabled={loading}
      >
        <FaCashRegister /> {payButtonText}
      </button>
    </div>
  );
});
