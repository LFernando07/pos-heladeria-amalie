import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("Todos los productos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Memoizamos la función para evitar recreación en cada render
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

  // ✅ Llamamos al montar
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Envolvemos las acciones en useCallback para que no cambien de referencia
  const addNewCategory = useCallback(
    async (newCategoryName) => {
      await createCategory(newCategoryName);
      await fetchCategories(); // refresca automáticamente
    },
    [fetchCategories]
  );

  const modifiedCategory = useCallback(
    async (id, updateCategoryName) => {
      await updateCategory(id, updateCategoryName);
      await fetchCategories();
    },
    [fetchCategories]
  );

  const removeCategory = useCallback(
    async (id) => {
      await deleteCategory(id);
      await fetchCategories();
    },
    [fetchCategories]
  );

  // ✅ Memoizamos el value para reducir renders en componentes consumidores
  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      active,
      setActive,
      refreshCategories: fetchCategories,
      addNewCategory,
      modifiedCategory,
      removeCategory,
    }),
    [
      categories,
      loading,
      error,
      active,
      fetchCategories,
      addNewCategory,
      modifiedCategory,
      removeCategory,
    ]
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

// Hook personalizado
// eslint-disable-next-line react-refresh/only-export-components
export const useCategories = () => useContext(CategoriesContext);
