import api from "../config/api";

export const fetchSabores = async (categoriaId) => {
  const response = await api.get(`/categorias-sabores/${categoriaId}`);
  return response;
};
