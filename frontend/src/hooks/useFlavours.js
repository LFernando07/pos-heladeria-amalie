import { useState, useEffect, useCallback } from "react";
import { fetchSabores } from "../services/flavours.service";

export const useFlavours = (categoriaId) => {
  const [sabores, setSabores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSabores = useCallback(async () => {
    if (!categoriaId) return; // Previene llamadas innecesarias si no hay ID
    setLoading(true);
    setError(null);

    try {
      const { data } = await fetchSabores(categoriaId);
      setSabores(data);
    } catch (err) {
      console.error("Error al cargar sabores:", err);
      setError("No se pudo cargar la lista de sabores. Verifica el servidor.");
    } finally {
      setLoading(false);
    }
  }, [categoriaId]);

  useEffect(() => {
    loadSabores();
  }, [loadSabores]);

  return {
    sabores,
    setSabores,
    loading,
    error,
    refreshSabores: loadSabores,
  };
};
