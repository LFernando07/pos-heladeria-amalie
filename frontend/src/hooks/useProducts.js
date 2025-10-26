import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchProducts as getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById,
} from "../services/products.service";

export const useProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoria, setCategoria] = useState("Todos los productos");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await getProducts();
      setProductos(productsData.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const products = useMemo(() => {
    return categoria === "Todos los productos"
      ? productos
      : productos.filter((p) => p.categoria === categoria);
  }, [categoria, productos]);

  const newProduct = async (data) => {
    await createProduct(data);
    await fetchProducts();
  };

  const editProduct = async (id, data) => {
    await updateProduct(id, data);
    await fetchProducts();
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    await fetchProducts();
  };

  const getProduct = async (id) => {
    return await getProductById(id);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    productos,
    setProductos,
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    newProduct,
    editProduct,
    removeProduct,
    getProduct,
    categoria,
    setCategoria,
  };
};
