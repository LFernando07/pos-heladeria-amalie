import { useState, useEffect } from "react";
import { fetchSabores } from "../services/flavours.service";

export const useFlavours = (categoriaId) => {
  const [sabores, setSabores] = useState([]);

  // Efecto de carga de sabores por categoria del producto
  useEffect(() => {
    // Peticion al servidor para obtener los sabores
    // Sabores de la categoria perteneciente a producto
    fetchSabores(categoriaId)
      .then((result) => setSabores(result.data))
      .catch((error) => {
        console.error("Error al cargar el sabores:", error);
        alert(
          "No se pudo cargar la lista de sabores. Revisar si el servidor está corriendo."
        );
      });
  }, [categoriaId]);

  return {
    sabores,
    setSabores,
  };
};
