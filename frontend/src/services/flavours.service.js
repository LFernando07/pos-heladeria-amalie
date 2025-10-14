export const fetchSabores = async (categoriaId) => {
  const response = await fetch(
    `http://localhost:3001/api/categorias-sabores/${categoriaId}`
  );
  if (!response.ok) {
    throw new Error("NO se pudo conectar con el servidor.");
  }
  const result = await response.json();
  return result;
};
