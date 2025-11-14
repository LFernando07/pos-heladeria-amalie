import React, { useState, useMemo, useCallback } from "react";
import { useSales } from "../../hooks/useSales";
import { Modal } from "../shared/Modal";
import SaleDetails from "./saleDetails";
import { BiDetail } from "react-icons/bi";
import "./SalesManagement.css";

const SalesManagement = () => {
  const { sales, loading, error } = useSales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // Calcular estadísticas automáticamente
  const stats = useMemo(() => {
    if (!sales || sales.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        averageSale: 0,
        todaySales: 0,
      };
    }

    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter((sale) => sale.fecha === today);
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (sale.total || 0),
      0
    );

    return {
      totalSales: sales.length,
      totalRevenue: totalRevenue,
      averageSale: totalRevenue / sales.length,
      todaySales: todaySales.length,
    };
  }, [sales]);

  const handleViewDetails = useCallback((sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSale(null);
  }, []);

  const renderSalesTable = useMemo(() => {
    if (sales.length === 0) {
      return <p>No hay ventas registradas, realice una venta primero!</p>;
    }

    return (
      <table className="sales-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Total</th>
            <th>Pagado</th>
            <th>Cambio</th>
            <th>Empleado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td data-label="ID">
                <span className="sale-id">#{sale.id}</span>
              </td>
              <td data-label="Fecha">
                <span className="sale-date">{sale.fecha}</span>
              </td>
              <td data-label="Hora">
                <span className="sale-time">{sale.hora}</span>
              </td>
              <td data-label="Total">
                <span className="money-value money-total">
                  ${(sale.total || 0).toFixed(2)}
                </span>
              </td>
              <td data-label="Pagado">
                <span className="money-value money-paid">
                  ${(sale.pagado || 0).toFixed(2)}
                </span>
              </td>
              <td data-label="Cambio">
                <span className="money-value money-change">
                  ${(sale.cambio || 0).toFixed(2)}
                </span>
              </td>
              <td data-label="Empleado">
                <span className="employee-badge">{sale.empleado_nombre}</span>
              </td>
              <td data-label="Acciones" className="actions-cell">
                <button
                  className="btn-details"
                  onClick={() => handleViewDetails(sale)}
                >
                  <BiDetail size={18} /> Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [sales, handleViewDetails]);

  // Estado de carga mejorado
  if (loading) {
    return (
      <div className="sales-container">
        <div className="loading-state">Cargando historial de ventas...</div>
      </div>
    );
  }

  // Estado de error mejorado
  if (error) {
    return (
      <div className="sales-container">
        <div className="error-state">Error al cargar las ventas: {error}</div>
      </div>
    );
  }

  return (
    <div className="sales-container">
      {/* Header con título */}
      <div className="sales-header">
        <h1>Historial de Ventas</h1>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="sales-stats">
        <div className="stat-card">
          <h3>Total de Ventas</h3>
          <p>{stats.totalSales}</p>
        </div>
        <div className="stat-card">
          <h3>Ingresos Totales</h3>
          <p>${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Promedio por Venta</h3>
          <p>${stats.averageSale.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Ventas Hoy</h3>
          <p>{stats.todaySales}</p>
        </div>
      </div>

      {/* render de tabla de ventas */}
      {renderSalesTable}

      {/* Modal de detalles */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="modal-header">
            <h2>Venta #{selectedSale?.id}</h2>
          </div>
          <SaleDetails saleId={selectedSale.id} />
        </Modal>
      )}
    </div>
  );
};

export default React.memo(SalesManagement);
