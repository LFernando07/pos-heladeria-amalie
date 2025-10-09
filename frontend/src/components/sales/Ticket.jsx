// src/features/sales/components/Ticket.jsx
import { useTicket } from "../../hooks/useTicket";
import { NumericKeypad } from "./NumericKeypad";
import { SuccessToast } from "./SuccessToast";
import "./Ticket.css";
import { TicketActions } from "./TicketActions";
import { TicketHeader } from "./TicketHeader";
import { TicketItems } from "./TicketItems";
import { TicketPaymentDetails } from "./TicketPaymentDetails";

const Ticket = ({ items, onClear, onIncrement, onDecrement }) => {
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

      {showSuccessToast && <SuccessToast />}
    </>
  );
};

export default Ticket;
