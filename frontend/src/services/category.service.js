export const fetchCategorias = async () => {
  const response = await fetch("http://localhost:3001/api/categorias");
  if (!response.ok) {
    throw new Error("NO se pudo conectar con el servidor.");
  }
  const result = await response.json();

  return result;
};
