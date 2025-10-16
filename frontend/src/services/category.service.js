
/**ESTE SERVICIO SE ENCARGA DE GESTIONAR LAS CATEGORÍAS EN EL DASHBOARD */
//http://localhost:3001/api/categorias

const API_URL = `http://localhost:3001/api/categorias`;

//Obtiene todas las categorías.

export const getCategories = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener las categorías.');
  }
  const data = await response.json();
  return data.data; // Devolvemos el array de categorías
};

/**
Crea una nueva categoría.
@param {string} nombre - El nombre de la nueva categoría.
 */
export const createCategory = async (nombre) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre }),
  });
  if (!response.ok) {
    throw new Error('No se pudo crear la categoría.');
  }
  return response.json();
};

/**
 * Actualiza una categoría existente.
 * @param {number} id - El ID de la categoría a actualizar.
 * @param {string} nombre - El nuevo nombre para la categoría.
 */
export const updateCategory = async (id, nombre) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre }),
  });
  if (!response.ok) {
    throw new Error('No se pudo actualizar la categoría.');
  }
  return response.json();
};

/**
 * Elimina una categoría por su ID.
 * @param {number} id - El ID de la categoría a eliminar.
 */
export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('No se pudo eliminar la categoría.');
  }
  return response.json();
};