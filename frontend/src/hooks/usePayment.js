import { useState, useEffect } from "react";

export const usePayment = (total) => {
  const [montoRecibido, setMontoRecibido] = useState("");
  const [cambio, setCambio] = useState(0);

  useEffect(() => {
    const recibido = parseFloat(montoRecibido) || 0;
    setCambio(recibido >= total ? recibido - total : 0);
  }, [montoRecibido, total]);

  const handleKeyPress = (key) => {
    if (key === "C") {
      setMontoRecibido("");
    } else if (key === "⌫") {
      setMontoRecibido((prev) => prev.slice(0, -1));
    } else if (key === "." && montoRecibido.includes(".")) {
      return;
    } else {
      setMontoRecibido((prev) => prev + key);
    }
  };

  const resetPayment = () => {
    setMontoRecibido("");
    setCambio(0);
  };

  return {
    montoRecibido,
    cambio,
    handleKeyPress,
    resetPayment,
  };
};
