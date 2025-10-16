
/*este hook se encargará de usar el servicio que se acaba de crear 'mngproducts.service.js'
para obtener los datos y manejará los estados de carga y error. */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchProducts as getProducts, createProduct } from '../services/products.service';

export const useProducts = () => {
  const [productos, setproductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoria, setCategoria] = useState("Todos los productos");

  // Usamos useCallback para que la función no se recree en cada render
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await getProducts();
      setproductos(productsData.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //Funcion para realizar el filtrado de productos
  const products = useMemo(() => {
    return categoria === "Todos los productos"
      ? productos
      : productos.filter((p) => p.categoria === categoria);
  }, [categoria, productos]);

  // Funcion para crear un nuevo producto
  const newProduct = async (data) => {
    await createProduct(data);
  };

  // useEffect para cargar los productos cuando el hook se usa por primera vez
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Devolvemos el estado y la función para refrescar
  return { productos, setproductos, products, loading, error, refreshProducts: fetchProducts, newProduct, categoria, setCategoria };
};