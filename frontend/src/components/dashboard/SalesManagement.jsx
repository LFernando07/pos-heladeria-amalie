/*ESTE COMPONENTE SE ENCARGA DE MOSTRAR LA TABLA DE VENTAS Y 
ABRIR EL MODAL PARA VER DETALLES DENTRO DE LA SECCIÓN 'ventas'
EN EL DASHBOARD */

import React, { useState } from 'react';
import { useSales } from '../../hooks/useSales';
import Modal from '../shared/Modal';
import SaleDetails from './saleDetails'; 
import { FcViewDetails } from 'react-icons/fc';
import { BiDetail } from 'react-icons/bi';

const SalesManagement = () => {
  const { sales, loading, error } = useSales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSale(null);
  }

  if (loading) return <p>Cargando ventas...</p>;
  if (error) return <p>Error al cargar las ventas: {error}</p>;

  return (
    <div className="management-container">
      <div className="page-header">
        <h1>Historial de Ventas</h1>
      </div>
      
      <table className="management-table">
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
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>#{sale.id}</td>
              <td>{sale.fecha}</td>
              <td>{sale.hora}</td>
              <td>${(sale.total || 0).toFixed(2)}</td>
              <td>${(sale.pagado || 0).toFixed(2)}</td>
              <td>${(sale.cambio || 0).toFixed(2)}</td>
              <td>{sale.empleado}</td>
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => handleViewDetails(sale)}>
                  <BiDetail size={25} /> Ver Detalles 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2>Detalles de Venta #{selectedSale?.id}</h2>
          {/* se renderiza el nuevo componente pasando el ID */}
          <SaleDetails saleId={selectedSale.id} />
        </Modal>
      )}
    </div>
  );
};

export default SalesManagement;