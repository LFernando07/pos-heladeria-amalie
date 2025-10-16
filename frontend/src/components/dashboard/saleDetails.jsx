/*ESTE COMPONENTE SE ENCARGA DE RECIBIR UN ID DE VENTA Y BUSCAR LOS DETALLES
A LA HORA DE QUE EL MODAL SE ABRE */

import React, { useState, useEffect } from 'react';
import { getSaleDetails } from '../../services/sales.service';

const SaleDetails = ({ saleId }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta función se ejecutará tan pronto como el componente se monte
    const fetchDetails = async () => {
      try {
        const saleDetails = await getSaleDetails(saleId);
        setDetails(saleDetails);
      } catch (err) {
        setError('No se pudieron cargar los detalles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [saleId]); // Se volverá a ejecutar si el ID de la venta cambia

  if (loading) {
    return <p>Cargando detalles...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <table className="details-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {details.map((item, index) => (
          // Usamos el índice en la key por si se repite el nombre del producto
          <tr key={`${item.nombre_producto}-${index}`}>
            <td>{item.nombre_producto}</td>
            <td>{item.cantidad}</td>
            <td>${item.subtotal.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SaleDetails;