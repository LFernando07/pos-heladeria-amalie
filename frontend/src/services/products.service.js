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
