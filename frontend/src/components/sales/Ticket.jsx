import { useMemo, useCallback } from "react";
import { useCartContext } from "../../context/CartContext";
import { NumericKeypad } from "./NumericKeypad";
import { SuccessToast } from "../shared/SuccessToast";
import { TicketHeader } from "./TicketHeader";
import { TicketItems } from "./TicketItems";
import { TicketPaymentDetails } from "./TicketPaymentDetails";
import { TicketActions } from "./TicketActions";
import "./Ticket.css";
import { useAuth } from "../../context/AuthContext";

export const Ticket = () => {
  const { ticket } = useCartContext();
  const {
    showKeypad,
    setShowKeypad,
    showSuccessToast,
    loading,
    handleKeyPress,
    handleProcessPayment,
    handleCancel,
    total,
    montoRecibido,
    cambio,
    formattedDate,
    formattedTime,
  } = ticket;

  const { user } = useAuth();

  // ✅ Memoriza el nombre del empleado para que no se recalcule cada render
  const nombreEmpleado = useMemo(() => user?.nombre || "Desconocido", [user]);

  // ✅ Memoriza handlers para evitar nuevas referencias en cada render
  const handleOpenKeypad = useCallback(
    () => setShowKeypad(true),
    [setShowKeypad]
  );
  const handleCloseKeypad = useCallback(
    () => setShowKeypad(false),
    [setShowKeypad]
  );

  return (
    <>
      <div className="ticket-container">
        <div className="ticket">
          <TicketHeader
            nombreEmpleado={nombreEmpleado}
            formattedDate={formattedDate}
            formattedTime={formattedTime}
          />

          <TicketItems />

          <TicketPaymentDetails
            total={total}
            montoRecibido={montoRecibido}
            cambio={cambio}
            onInputClick={handleOpenKeypad}
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
          onClose={handleCloseKeypad}
        />
      )}

      {showSuccessToast && <SuccessToast mensaje="Venta registrada" />}
    </>
  );
};
