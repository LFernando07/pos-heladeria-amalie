/*ESTE HOOK USA EL SERVICIO DE 'categories.service.js */


import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../services/category.service';


export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("Todos los productos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // se devuelce el estado y una función para refrescar la lista
  return { categories, loading, error, active, setActive, refreshCategories: fetchCategories };
};