import { useState, useEffect } from "react";
import { fetchCategorias } from "../services/category.service";

export const useCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [active, setActive] = useState("Todos los productos");

  // Efecto de carga de categorias
  useEffect(() => {
    // Peticion al servidor para obtener las categorias al iniciar la app
    fetchCategorias()
      .then((result) => setCategorias(result.data))
      .catch((error) => {
        console.error("Error al cargar el categorias:", error);
        alert(
          "No se pudo cargar la lista de categorias. Revisar si el servidor está corriendo."
        );
      });
  }, []);

  return {
    categorias,
    setCategorias,
    active,
    setActive,
  };
};
