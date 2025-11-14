import { memo, useMemo } from "react";
import { useCartContext } from "../../context/CartContext";

export const TicketPaymentDetails = memo(({ onInputClick }) => {
  const { ticket } = useCartContext();
  const { total, montoRecibido, cambio } = ticket;

  // Memoriza los valores formateados para evitar recomputar en cada render
  const formattedTotal = useMemo(() => `$${total.toFixed(2)}`, [total]);
  const formattedMontoRecibido = useMemo(
    () => (montoRecibido ? `$${montoRecibido}` : ""),
    [montoRecibido]
  );
  const formattedCambio = useMemo(() => `$${cambio.toFixed(2)}`, [cambio]);

  return (
    <div className="payment-details">
      <div className="total">
        <h2>Total a pagar:</h2>
        <h2>{formattedTotal}</h2>
      </div>

      <div className="amount-received">
        <label>Monto Recibido:</label>
        <input
          type="text"
          value={formattedMontoRecibido}
          placeholder="$0.00"
          readOnly
          onClick={onInputClick}
        />
      </div>

      <div className="change-display">
        <h3>Cambio:</h3>
        <h3>{formattedCambio}</h3>
      </div>
    </div>
  );
});

TicketPaymentDetails.displayName = "TicketPaymentDetails";
