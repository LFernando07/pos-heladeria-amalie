export const fetchProducts = async () => {
  const response = await fetch("http://localhost:3001/api/productos");
  if (!response.ok) {
    throw new Error("NO se pudo conectar con el servidor.");
  }
  const result = await response.json();

  return result;
};

export const createProduct = async (productData) => {
  const response = await fetch("http://localhost:3001/api/productos", {
    method: "POST",
    // No se especifica 'Content-Type'. El navegador lo hará automáticamente por nosotros.
    body: productData,
  });

  if (!response.ok) {
    throw new Error("Ocurrió un error al guardar el producto.");
  }
};

const API_URL = `http://localhost:3001/api/productos`;

/**
 * Elimina un producto por su ID.
 * @param {number} id - El ID del producto a eliminar.
 */
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('No se pudo eliminar el producto.');
  }
  return response.json();
};

