export const fetchProducts = async () => {
  const response = await fetch("http://localhost:3001/api/productos");
  if (!response.ok) {
    throw new Error("NO se pudo conectar con el servidor.");
  }
  const result = await response.json();

  return result;
};
