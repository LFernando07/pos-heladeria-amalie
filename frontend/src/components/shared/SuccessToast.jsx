import "./SuccessToast.css";

// --- Componente para la Animación de Éxito ---
export const SuccessToast = ({ mensaje }) => {
  return (
    <div className="success-toast">
      <div className="success-icon">
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
        </svg>
      </div>
      <p>{mensaje}</p>
    </div>
  );
};
