import { useState, useEffect, useCallback } from "react";

export const usePayment = (total) => {
  const [montoRecibido, setMontoRecibido] = useState("");
  const [cambio, setCambio] = useState(0);

  // 🧮 Calcula el cambio dinámicamente al modificar el monto o total
  useEffect(() => {
    const recibido = parseFloat(montoRecibido) || 0;
    setCambio(recibido > total ? recibido - total : 0);
  }, [montoRecibido, total]);

  // ⌨️ Maneja la lógica de entrada (teclas del teclado numérico o virtual)
  const handleKeyPress = useCallback((key) => {
    setMontoRecibido((prev) => {
      if (key === "C") return "";
      if (key === "⌫") return prev.slice(0, -1);
      if (key === "." && prev.includes(".")) return prev;
      if (!/^[0-9.]$/.test(key)) return prev; // Evita caracteres no numéricos
      return prev + key;
    });
  }, []);

  // 🔄 Resetea el estado del pago
  const resetPayment = useCallback(() => {
    setMontoRecibido("");
    setCambio(0);
  }, []);

  return {
    montoRecibido,
    cambio,
    handleKeyPress,
    resetPayment,
    setMontoRecibido,
  };
};
