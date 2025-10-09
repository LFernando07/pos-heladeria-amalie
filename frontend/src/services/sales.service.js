export const createSale = async (ventaData) => {
  const response = await fetch("http://localhost:3001/api/ventas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ventaData),
  });

  if (!response.ok) {
    throw new Error("Error al guardar la venta en la base de datos.");
  }

  const result = await response.json();
  return result;
};
