import api from "../config/api";

export const getCategories = async () => {
  const response = await api.get("/categorias");
  return response.data; // Devolvemos el array de categorías
};

/**
Crea una nueva categoría.
@param {string} nombre - El nombre de la nueva categoría.
 */
export const createCategory = async (nombre) => {
  const response = await api.post("/categorias", { nombre });
  return response;
};

/**
 * Actualiza una categoría existente.
 * @param {number} id - El ID de la categoría a actualizar.
 * @param {string} nombre - El nuevo nombre para la categoría.
 */
export const updateCategory = async (id, nombre) => {
  const response = await api.put(`/categorias/${id}`, { nombre });
  return response;
};

/**
 * Elimina una categoría por su ID.
 * @param {number} id - El ID de la categoría a eliminar.
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categorias/${id}`);
  return response;
};
