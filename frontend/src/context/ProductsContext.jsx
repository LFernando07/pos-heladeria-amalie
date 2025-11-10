import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchProducts as getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.service";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("Todos los productos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Memoizamos la función de carga
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

  // ✅ Llamamos al montar
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Filtro memoizado
  const products = useMemo(() => {
    return categoria === "Todos los productos"
      ? productos
      : productos.filter((p) => p.categoria === categoria);
  }, [categoria, productos]);

  // ✅ Acciones CRUD memoizadas
  const newProduct = useCallback(
    async (data) => {
      await createProduct(data);
      await fetchProducts();
    },
    [fetchProducts]
  );

  const editProduct = useCallback(
    async (id, data) => {
      await updateProduct(id, data);
      await fetchProducts();
    },
    [fetchProducts]
  );

  const removeProduct = useCallback(
    async (id) => {
      await deleteProduct(id);
      await fetchProducts();
    },
    [fetchProducts]
  );

  const getProduct = useCallback(async (id) => {
    return await getProductById(id);
  }, []);

  // ✅ Memoizamos el value para evitar renders innecesarios
  const value = useMemo(
    () => ({
      productos,
      products,
      loading,
      error,
      categoria,
      setCategoria,
      refreshProducts: fetchProducts,
      newProduct,
      editProduct,
      removeProduct,
      getProduct,
    }),
    [
      productos,
      products,
      loading,
      error,
      categoria,
      fetchProducts,
      newProduct,
      editProduct,
      removeProduct,
      getProduct,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// Hook personalizado
// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductsContext);
