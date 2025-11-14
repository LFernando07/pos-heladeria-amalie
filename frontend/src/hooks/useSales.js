/**
 * Hook para gestionar el listado principal de ventas.
 * Usa 'sales.service.js'
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { getSales } from "../services/sales.service";

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true); // 🛡️ evita actualizar estado si el componente se desmonta

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const salesData = await getSales();

      // Verifica que el componente siga montado antes de actualizar estado
      if (isMounted.current) {
        setSales(Array.isArray(salesData) ? salesData : []);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err?.message || "Error al cargar las ventas.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSales();

    // 🧹 Limpieza: marca el componente como desmontado
    return () => {
      isMounted.current = false;
    };
  }, [fetchSales]);

  return {
    sales,
    loading,
    error,
    refreshSales: fetchSales,
  };
};
