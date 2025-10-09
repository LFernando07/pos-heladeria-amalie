export const TicketPaymentDetails = ({
  total,
  montoRecibido,
  cambio,
  onInputClick,
}) => (
  <div className="payment-details">
    <div className="total">
      <h2>Total a pagar:</h2>
      <h2>${total.toFixed(2)}</h2>
    </div>
    <div className="amount-received">
      <label>Monto Recibido:</label>
      <input
        type="text"
        value={montoRecibido ? `$${montoRecibido}` : ""}
        placeholder="$0.00"
        readOnly
        onClick={onInputClick}
      />
    </div>
    <div className="change-display">
      <h3>Cambio:</h3>
      <h3>${cambio.toFixed(2)}</h3>
    </div>
  </div>
);
