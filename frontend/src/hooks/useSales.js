/**ESTE HOOK SE ENCARGA DE GESTIONAR EL LISTADO PRINCIPAL DE VENTAS
 * y usa 'sales.service.js'
 */

import { useState, useEffect, useCallback } from 'react';
import { getSales } from '../services/sales.service';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const salesData = await getSales();
      setSales(salesData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { sales, loading, error, refreshSales: fetchSales };
};