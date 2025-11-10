import { memo } from "react";

export const TicketHeader = memo(
  ({ nombreEmpleado, formattedDate, formattedTime }) => (
    <div className="ticket-header">
      <h1>RESUMEN DE LA VENTA</h1>
      <p>
        Atendido por: <b>{nombreEmpleado}</b>
      </p>
      <p>
        Fecha: {formattedDate} - Hora: {formattedTime}
      </p>
    </div>
  )
);

TicketHeader.displayName = "TicketHeader";
