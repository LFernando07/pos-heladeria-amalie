import { NumericKeypad } from "./NumericKeypad";
import { SuccessToast } from "../shared/SuccessToast";

import { useTicket } from "../../hooks/useTicket";
import { TicketActions } from "./TicketActions";
import { TicketHeader } from "./TicketHeader";
import { TicketItems } from "./TicketItems";
import { TicketPaymentDetails } from "./TicketPaymentDetails";
import "./Ticket.css";

export const Ticket = ({
  items,
  onClear,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const {
    total,
    montoRecibido,
    cambio,
    formattedDate,
    formattedTime,
    showKeypad,
    setShowKeypad,
    showSuccessToast,
    loading,
    handleKeyPress,
    handleProcessPayment,
    handleCancel,
  } = useTicket(items, onClear);

  const nombreEmpleado = "Jake Ponciano"; // TODO: Obtener del contexto de usuario

  return (
    <>
      <div className="ticket-container">
        <div className="ticket">
          <TicketHeader
            nombreEmpleado={nombreEmpleado}
            formattedDate={formattedDate}
            formattedTime={formattedTime}
          />

          <TicketItems
            items={items}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRemove={onRemove}
          />

          <TicketPaymentDetails
            total={total}
            montoRecibido={montoRecibido}
            cambio={cambio}
            onInputClick={() => setShowKeypad(true)}
          />

          <TicketActions
            onCancel={handleCancel}
            onPay={handleProcessPayment}
            loading={loading}
          />
        </div>
      </div>

      {showKeypad && (
        <NumericKeypad
          onKeyPress={handleKeyPress}
          onClose={() => setShowKeypad(false)}
        />
      )}

      {showSuccessToast && <SuccessToast mensaje={"Venta registrada"} />}
    </>
  );
};
