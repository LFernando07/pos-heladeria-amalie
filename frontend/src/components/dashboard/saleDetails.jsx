// src/components/sales/SaleDetails.jsx
import React, { useMemo } from "react";
import { useSaleDetails } from "../../hooks/useSalesDetails";
import "./SaleDetails.css";

const SaleDetails = ({ saleId }) => {
  const { details, total, totalItems, loading, error } = useSaleDetails(saleId);

  const renderedItems = useMemo(() => {
    return details.map((item, index) => (
      <div key={`${item.nombre_producto}-${index}`} className="product-item">
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
    ));
  }, [details]);

  if (loading) {
    return (
      <div className="sale-details-container">
        <div className="details-loading">Cargando detalles de la venta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sale-details-container">
        <div className="details-error">{error}</div>
      </div>
    );
  }

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
      {/* Información resumida */}
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

      {/* Lista de productos */}
      <div className="products-list">{renderedItems}</div>

      <hr className="details-divider" />

      <div className="sale-total">
        <span className="total-label">Total de la Venta</span>
        <span className="total-amount">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SaleDetails;
