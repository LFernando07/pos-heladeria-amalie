
const API_URL = `http://localhost:3001/api/reports`;

/**
 * Obtiene el reporte de ventas para un rango de fechas.
 * @param {string} startDate - Fecha de inicio en formato YYYY-MM-DD.
 * @param {string} endDate - Fecha de fin en formato YYYY-MM-DD.
 */
export const getSalesReport = async (startDate, endDate) => {
  // Las fechas se pasan como "query parameters" en la URL
  const response = await fetch(`${API_URL}/sales?startDate=${startDate}&endDate=${endDate}`);
  
  if (!response.ok) {
    throw new Error('No se pudo generar el reporte.');
  }
  
  const data = await response.json();
  return data.data; // Devolvemos el array de ventas filtradas
};

/**
 * Envía el reporte generado a un correo electrónico a través del backend.
 * @param {FormData} formData - El objeto FormData que contiene el correo, asunto, cuerpo y el archivo PDF.
 */
export const sendReportByEmail = async (formData) => {
  // Nota: La URL completa es /api/reports/email
  const response = await fetch(`http://localhost:3001/api/reports/email`, {
    method: 'POST',
    body: formData, // No se necesita 'Content-Type' header con FormData
  });

  if (!response.ok) {
    throw new Error('El servidor no pudo enviar el correo.');
  }

  return response.text(); // Devuelve el mensaje de éxito del servidor
};