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

//----------------- MODIFICACIONES REALIZADAS POR JAKE ---------------------------------//
//`${import.meta.env.VITE_API_URL}/api/ventas`

const SALES_API_URL  = `http://localhost:3001/api/ventas`;


 //Obtiene el historial de todas las ventas.

export const getSales = async () => {
  const response = await fetch(SALES_API_URL);
  if (!response.ok) {
    throw new Error('No se pudo obtener el historial de ventas.');
  }
  const data = await response.json();
  return data.data; // Devolvemos el array de ventas
};

/**
 * Obtiene los productos de una venta específica por su ID.
 * @param {number} id - El ID de la venta.
 */
export const getSaleDetails = async (id) => {
  const response = await fetch(`${SALES_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudieron obtener los detalles de la venta.');
  }
  const data = await response.json();
  return data.data; // Devolvemos el array de productos de esa venta
};
//----------------- FIN MODIFICACIONES REALIZADAS POR JAKE ---------------------------------//