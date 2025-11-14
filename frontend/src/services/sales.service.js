import api from "../config/api";

export const createSale = async (ventaData) => {
  const response = await api.post("/ventas", ventaData);
  return response;
};

//----------------- MODIFICACIONES REALIZADAS POR JAKE ---------------------------------//

//Obtiene el historial de todas las ventas.
export const getSales = async () => {
  const response = await api.get("/ventas");
  return response.data; // Devolvemos el array de ventas
};

/**
 * Obtiene los productos de una venta específica por su ID.
 * @param {number} id - El ID de la venta.
 */
export const getSaleDetails = async (id) => {
  const response = await api.get(`/ventas/${id}`);
  return response.data; // Devolvemos el array de productos de esa venta
};
//----------------- FIN MODIFICACIONES REALIZADAS POR JAKE ---------------------------------//
