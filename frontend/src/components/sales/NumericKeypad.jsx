import { useMemo, useCallback } from "react";

export const NumericKeypad = ({ onKeyPress, onClose }) => {
  // Memoriza las teclas, así no se recalculan en cada render
  const keys = useMemo(
    () => ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"],
    []
  );

  // Memoriza el handler para evitar crear nuevas funciones en cada render
  const handleKeyClick = useCallback(
    (key) => {
      onKeyPress(key);
    },
    [onKeyPress]
  );

  const handleCloseClick = useCallback(
    (e) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <div className="keypad-backdrop" onClick={onClose}>
      <div className="keypad" onClick={(e) => e.stopPropagation()}>
        <div className="keypad-header">
          <span>Ingresar Monto</span>
          <button className="keypad-close-btn" onClick={handleCloseClick}>
            ×
          </button>
        </div>

        <div className="keypad-grid">
          {keys.map((key) => (
            <button key={key} onClick={() => handleKeyClick(key)}>
              {key}
            </button>
          ))}
          <button
            className="keypad-clear-btn"
            onClick={() => handleKeyClick("C")}
          >
            C
          </button>
        </div>
      </div>
    </div>
  );
};
