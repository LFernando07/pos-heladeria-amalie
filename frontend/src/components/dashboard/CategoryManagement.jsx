import React, { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "../shared/Modal";
import "./CategoryManagement.css";

const CategoryManagement = () => {
  const { categories, loading, error, refreshCategories } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");

  // Estados para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Estados para el modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Agregar nueva categoría
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }
    try {
      await createCategory(newCategoryName);
      setNewCategoryName("");
      refreshCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  // Abrir modal de edición
  const openEditModal = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.nombre);
    setIsEditModalOpen(true);
  };

  // Cerrar modal de edición
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
    setEditCategoryName("");
  };

  // Confirmar edición
  const confirmEdit = async () => {
    if (!editCategoryName.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }
    if (editCategoryName === editingCategory.nombre) {
      closeEditModal();
      return;
    }
    try {
      await updateCategory(editingCategory.id, editCategoryName);
      refreshCategories();
      closeEditModal();
    } catch (err) {
      alert(err.message);
    }
  };

  // Abrir modal de eliminación
  const openDeleteModal = (category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await deleteCategory(deletingCategory.id);
      refreshCategories();
      closeDeleteModal();
    } catch (err) {
      alert(err.message);
      closeDeleteModal();
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="category-container">
        <div className="category-loading">Cargando categorías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-container">
        <div className="category-error">
          Error al cargar las categorías: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="category-container">
      {/* Header */}
      <div className="category-header">
        <h1>Gestión de Categorías</h1>
      </div>

      {/* Formulario para añadir nueva categoría */}
      <form onSubmit={handleAddCategory} className="add-category-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la nueva categoría"
        />
        <button type="submit" className="btn-add-category">
          <AiOutlineFolderAdd size={20} />
          Agregar Categoría
        </button>
      </form>

      {/* Tabla de categorías existentes */}
      {categories.length === 0 ? (
        <div className="empty-categories">
          <p>No hay categorías registradas. ¡Crea la primera!</p>
        </div>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td data-label="ID">
                  <span className="category-id">#{category.id}</span>
                </td>
                <td data-label="Nombre">
                  <span className="category-name">{category.nombre}</span>
                </td>
                <td data-label="Acciones" className="category-actions">
                  <button
                    className="btn-edit-cat"
                    onClick={() => openEditModal(category)}
                  >
                    <FaEdit />
                    Editar
                  </button>
                  <button
                    className="btn-delete-cat"
                    onClick={() => openDeleteModal(category)}
                  >
                    <FaTrashAlt />
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <Modal onClose={closeEditModal}>
          <div className="category-modal-content">
            <h2>✏️ Editar Categoría</h2>
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="category-modal-input"
              placeholder="Nombre de la categoría"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
            />
            <div className="category-modal-buttons">
              <button onClick={closeEditModal} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={confirmEdit} className="btn-confirm">
                Guardar Cambios
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Eliminación */}
      {isDeleteModalOpen && (
        <Modal onClose={closeDeleteModal}>
          <div className="category-modal-content">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2>¿Eliminar categoría?</h2>
            <p
              style={{
                color: "#666",
                marginBottom: "1.5rem",
                fontSize: "1.05rem",
                lineHeight: "1.6",
              }}
            >
              ¿Estás seguro de que quieres eliminar la categoría{" "}
              <strong style={{ color: "#DC143C" }}>
                "{deletingCategory?.nombre}"
              </strong>
              ?
              <br />
              <span style={{ fontSize: "0.9rem", color: "#999" }}>
                Esta acción no se puede deshacer.
              </span>
            </p>
            <div className="category-modal-buttons">
              <button onClick={closeDeleteModal} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="btn-confirm delete">
                Sí, eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CategoryManagement;
