const API_URL = `http://localhost:3001/api/productos`;

export const fetchProducts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("No se pudo conectar con el servidor.");
  return await response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: productData, // FormData (no se agrega Content-Type)
  });
  if (!response.ok) throw new Error("Ocurrió un error al guardar el producto.");
  return await response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("No se encontró el producto.");
  return await response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("No se pudo actualizar el producto.");
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("No se pudo eliminar el producto.");
  return response.json();
};
