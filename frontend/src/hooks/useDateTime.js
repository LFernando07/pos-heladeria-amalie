import { useState, useEffect, useMemo } from "react";

export const useDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());

  useEffect(() => {
    // 🕒 Actualiza la hora cada segundo
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Solo recalcula las cadenas formateadas cuando cambia la fecha/hora
  const { formattedDate, formattedTime } = useMemo(() => {
    const formattedDate = currentDateTime.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = currentDateTime.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return { formattedDate, formattedTime };
  }, [currentDateTime]);

  return { formattedDate, formattedTime, currentDateTime };
};
