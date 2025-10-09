export const TicketHeader = ({
  nombreEmpleado,
  formattedDate,
  formattedTime,
}) => (
  <div className="ticket-header">
    <h1>RESUMEN DE LA VENTA</h1>
    <p>Atendido por: {nombreEmpleado}</p>
    <p>
      Fecha: {formattedDate} - Hora: {formattedTime}
    </p>
  </div>
);
