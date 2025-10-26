/*ESTE COMPONENTE SE ENCARGA DE RECIBIR UN ID DE VENTA Y BUSCAR LOS DETALLES
A LA HORA DE QUE EL MODAL SE ABRE */

import React, { useState, useEffect, useMemo } from "react";
import { getSaleDetails } from "../../services/sales.service";
import "./SaleDetails.css";

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
        setError("No se pudieron cargar los detalles de la venta.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [saleId]); // Se volverá a ejecutar si el ID de la venta cambia

  // Calcular el total de la venta
  const total = useMemo(() => {
    return details.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }, [details]);

  // Calcular cantidad total de productos
  const totalItems = useMemo(() => {
    return details.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  }, [details]);

  // Estado de carga
  if (loading) {
    return (
      <div className="sale-details-container">
        <div className="details-loading">Cargando detalles de la venta...</div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="sale-details-container">
        <div className="details-error">{error}</div>
      </div>
    );
  }

  // Estado vacío
  if (!details || details.length === 0) {
    return (
      <div className="sale-details-container">
        <div className="empty-details">
          No se encontraron productos en esta venta.
        </div>
      </div>
    );
  }

  return (
    <div className="sale-details-container">
      {/* Información resumida en tarjetas */}
      <div className="sale-info-grid">
        <div className="info-item">
          <div className="info-label">Total de Productos</div>
          <div className="info-value">
            {details.length} tipo{details.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="info-item">
          <div className="info-label">Cantidad Total</div>
          <div className="info-value">
            {totalItems} unidad{totalItems !== 1 ? "es" : ""}
          </div>
        </div>
      </div>

      {/* Lista de productos estilo ticket */}
      <div className="products-list">
        {details.map((item, index) => (
          <div
            key={`${item.nombre_producto}-${index}`}
            className="product-item"
          >
            <div className="product-info">
              <div className="product-name">{item.nombre_producto}</div>
              <div className="product-quantity">
                {item.cantidad} {item.cantidad === 1 ? "unidad" : "unidades"}
              </div>
            </div>
            <div className="product-price">
              <span className="price-label">Subtotal</span>
              <div className="price-value">${item.subtotal.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Separador visual */}
      <hr className="details-divider" />

      {/* Total general destacado */}
      <div className="sale-total">
        <span className="total-label">Total de la Venta</span>
        <span className="total-amount">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SaleDetails;
