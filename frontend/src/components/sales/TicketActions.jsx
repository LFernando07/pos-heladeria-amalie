import { FaTrash, FaCashRegister } from "react-icons/fa";

export const TicketActions = ({ onCancel, onPay, loading }) => (
  <div className="actions">
    <button className="cancel-btn" onClick={onCancel} disabled={loading}>
      <FaTrash /> CANCELAR ORDEN
    </button>
    <button className="pay-btn" onClick={onPay} disabled={loading}>
      <FaCashRegister /> {loading ? "PROCESANDO..." : "COBRAR EN EFECTIVO"}
    </button>
  </div>
);
