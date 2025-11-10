import { memo, useCallback } from "react";
import "./Modal.css";

export const Modal = memo(({ children, onClose }) => {
  // Evita recrear la función en cada render
  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
});
