// src/hooks/useSaleDetails.js
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getSaleDetails } from "../services/sales.service";

export const useSaleDetails = (saleId) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true); // 🧩 evita actualizaciones después de desmontar

  // --- Función que obtiene los detalles ---
  const fetchSaleDetails = useCallback(async () => {
    if (!saleId) return;

    try {
      setLoading(true);
      setError(null);

      const saleDetails = await getSaleDetails(saleId);

      if (isMounted.current) {
        setDetails(Array.isArray(saleDetails) ? saleDetails : []);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error("Error al obtener detalles de la venta:", err);
        setError("No se pudieron cargar los detalles de la venta.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [saleId]);

  // --- Cargar detalles al cambiar el ID ---
  useEffect(() => {
    fetchSaleDetails();

    return () => {
      isMounted.current = false; // Limpieza segura
    };
  }, [fetchSaleDetails]);

  // --- Cálculos derivados (memoizados) ---
  const total = useMemo(() => {
    return details.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }, [details]);

  const totalItems = useMemo(() => {
    return details.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  }, [details]);

  // --- Valor expuesto del hook ---
  return {
    details,
    total,
    totalItems,
    loading,
    error,
    refreshSaleDetails: fetchSaleDetails,
  };
};
