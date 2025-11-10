import React, { useCallback, useMemo, useState } from "react";
import { useCategories } from "../../context/CategoryContext";
import { useProducts } from "../../context/ProductsContext";
import { Link } from "react-router";
import { Modal } from "../shared/Modal";
import { MdOutlineCreate } from "react-icons/md";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import "./ProductManagement.css";

const ProductManagement = () => {
  const {
    products,
    loading,
    error,
    refreshProducts,
    editProduct,
    removeProduct,
  } = useProducts();

  const { categories } = useCategories();

  // Estados para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductPrice, setEditProductPrice] = useState(0);
  const [editProductCategory, setEditProductCategory] = useState("");

  // Estados para el modal de eliminacion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Abrir modal de edición
  const openEditModal = useCallback((product) => {
    setEditingProduct(product);
    setEditProductName(product.nombre);
    setEditProductPrice(product.precio);
    setEditProductCategory(product.categoria_id);
    setIsEditModalOpen(true);
  }, []);

  // Cerrar modal de edición
  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditProductName("");
    setEditProductPrice(0);
    setEditProductCategory("");
  }, []);

  // Confirmar edición
  const confirmEdit = useCallback(async () => {
    if (!editProductName.trim()) {
      alert("El nombre del producto no puede estar vacío.");
      return;
    }
    if (editProductPrice <= 0) {
      alert("El precio del producto no puede ser igual o menor a cero.");
      return;
    }

    // Comprobar si realmente hubo algún cambio
    const noChanges =
      editProductName === editingProduct.nombre &&
      parseFloat(editProductPrice) === parseFloat(editingProduct.precio) &&
      parseInt(editProductCategory) === editingProduct.categoria_id;

    if (noChanges) {
      return;
    }

    const data = {
      nombre: editProductName,
      precio: editProductPrice,
      categoria_id: parseInt(editProductCategory),
      requiere_sabor: editingProduct.requiere_sabor,
      disponible: editingProduct.disponible,
    };

    try {
      await editProduct(editingProduct.id, data);
      refreshProducts();
      closeEditModal();
    } catch (err) {
      alert(err.message);
    }
  }, [
    editProductName,
    editProductPrice,
    editProductCategory,
    editingProduct,
    editProduct,
    refreshProducts,
    closeEditModal,
  ]);

  // Abrir modal de eliminación
  const handleDeleteClick = useCallback((product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  }, []);

  // Cerrar modal de eliminación
  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  }, []);

  // Confirmar eliminación
  const confirmDelete = useCallback(async () => {
    try {
      await removeProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      refreshProducts();
    } catch (err) {
      alert(err.message);
    }
  }, [productToDelete, refreshProducts, removeProduct]);

  const renderTable = useMemo(() => {
    if (products.length === 0) {
      return (
        <div className="empty-products">
          <p>No hay productos registrados.</p>
          <Link to="/dashboard/products/new" className="btn-add-product">
            <MdOutlineCreate size={20} /> Crear primer producto
          </Link>
        </div>
      );
    }

    return (
      <table className="product-management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const imagenProducto = product.imagen || "./images/placeholder.png";
            return (
              <tr key={product.id}>
                <td data-label="ID">
                  <span className="product-id">#{product.id}</span>
                </td>
                <td data-label="Imagen">
                  <img
                    src={imagenProducto}
                    alt={product.nombre}
                    className="product-table-img"
                  />
                </td>
                <td data-label="Nombre">
                  <span>{product.nombre}</span>
                </td>
                <td data-label="Precio">
                  <span className="product-price">
                    ${product.precio.toFixed(2)}
                  </span>
                </td>
                <td data-label="Categoría">
                  <span className="product-category">{product.categoria}</span>
                </td>
                <td data-label="Acciones" className="product-actions-cell">
                  <button
                    className="btn-edit-product"
                    onClick={() => openEditModal(product)}
                  >
                    <FaEdit />
                    Editar
                  </button>
                  <button
                    className="btn-delete-product"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <FaTrashAlt />
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }, [handleDeleteClick, openEditModal, products]);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="product-management-container">
        <div className="product-loading">Cargando catalogo de productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-management-container">
        <div className="product-error">
          Error al cargar los productos: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="product-management-container">
      <div className="product-page-header">
        <h1>Catálogo de Productos</h1>
        <Link to="/dashboard/products/new" className="btn-add-product">
          <MdOutlineCreate size={20} /> Agregar Producto
        </Link>
      </div>

      {/* // Componente de tabla de products */}
      {renderTable}

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <Modal onClose={closeEditModal}>
          <div className="product-modal-content">
            <h2>✏️ Editar Producto</h2>
            <input
              type="text"
              value={editProductName}
              onChange={(e) => setEditProductName(e.target.value)}
              className="product-modal-input"
              placeholder="Nombre del producto"
              autoFocus
            />
            <input
              type="number"
              value={editProductPrice}
              onChange={(e) => setEditProductPrice(e.target.value)}
              className="product-modal-input"
              placeholder="Precio del producto"
              onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
            />
            <select
              value={editProductCategory}
              onChange={(e) => setEditProductCategory(e.target.value)}
              className="product-modal-input"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <div className="product-modal-buttons">
              <button
                onClick={closeEditModal}
                className="btn-cancel-edit-product"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEdit}
                className="btn-confirm-edit-product"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && (
        <Modal onClose={cancelDelete}>
          <div className="product-modal-content">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2>¿Eliminar producto?</h2>

            <div className="product-delete-info">
              <p>
                <strong>Producto:</strong> {productToDelete?.nombre}
              </p>
              <p>
                <strong>Precio:</strong> ${productToDelete?.precio.toFixed(2)}
              </p>
              <p>
                <strong>Categoría:</strong> {productToDelete?.categoria}
              </p>
            </div>

            <p
              style={{
                color: "#666",
                fontSize: "1rem",
                marginBottom: "1rem",
              }}
            >
              ¿Estás seguro de que quieres eliminar este producto?
              <br />
              <span style={{ fontSize: "0.9rem", color: "#999" }}>
                Esta acción no se puede deshacer.
              </span>
            </p>

            <div className="product-modal-buttons">
              <button onClick={cancelDelete} className="btn-cancel-product">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="btn-confirm-delete">
                Sí, eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default React.memo(ProductManagement);
