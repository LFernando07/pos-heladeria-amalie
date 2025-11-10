import api, { API_URL } from "../config/api";

export const fetchProducts = async () => {
  const response = await api.get("/productos");
  return response;
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/api/productos`, {
    method: "POST",
    body: productData, // FormData (no se agrega Content-Type)
  });
  if (!response.ok) throw new Error("Ocurrió un error al guardar el producto.");
  return await response.json();
};

export const getProductById = async (id) => {
  const response = await api.get(`/productos/${id}`);
  return response;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/productos/${id}`, productData);
  return response;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response;
};
