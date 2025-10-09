// --- Componente del Teclado Numérico ---
export const NumericKeypad = ({ onKeyPress, onClose }) => {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
  return (
    <div className="keypad-backdrop" onClick={onClose}>
      <div className="keypad" onClick={(e) => e.stopPropagation()}>
        <div className="keypad-header">
          <span>Ingresar Monto</span>
          <button className="keypad-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="keypad-grid">
          {keys.map((key) => (
            <button key={key} onClick={() => onKeyPress(key)}>
              {key}
            </button>
          ))}
          <button className="keypad-clear-btn" onClick={() => onKeyPress("C")}>
            C
          </button>
        </div>
      </div>
    </div>
  );
};
