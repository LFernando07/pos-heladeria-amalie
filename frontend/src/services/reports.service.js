import api, { API_URL } from "../config/api";
/**
 * Obtiene el reporte de ventas para un rango de fechas.
 * @param {string} startDate - Fecha de inicio en formato YYYY-MM-DD.
 * @param {string} endDate - Fecha de fin en formato YYYY-MM-DD.
 */
export const getSalesReport = async (startDate, endDate) => {
  // Las fechas se pasan como "query parameters" en la URL
  const response = await api.get(
    `/reports/sales?startDate=${startDate}&endDate=${endDate}`
  );

  return response.data; // Devolvemos el array de ventas filtradas
};

/**
 * Envía el reporte generado a un correo electrónico a través del backend.
 * @param {FormData} formData - El objeto FormData que contiene el correo, asunto, cuerpo y el archivo PDF.
 */
export const sendReportByEmail = async (formData) => {
  const response = await fetch(`${API_URL}/api/reports/email`, {
    method: "POST",
    body: formData, // No se necesita Content-Type con FormData
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "El servidor no pudo enviar el correo.");
  }

  const data = await response.json();
  return data; // { message: "Correo enviado exitosamente" }
};
