import React, { useState, useCallback, useMemo } from "react";
import { useCategories } from "../../context/CategoryContext";
import { Modal } from "../shared/Modal";
import { SuccessToast } from "../shared/SuccessToast";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./CategoryManagement.css";

const CategoryManagement = () => {
  const {
    categories,
    loading,
    error,
    refreshCategories,
    addNewCategory,
    modifiedCategory,
    removeCategory,
  } = useCategories();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // 🔹 Agregar categoría (memorizado)
  const handleAddCategory = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newCategoryName.trim()) {
        alert("El nombre de la categoría no puede estar vacío.");
        return;
      }
      try {
        await addNewCategory(newCategoryName);
        setShowSuccessToast(true);
        setNewCategoryName("");
        setTimeout(refreshCategories, 2000);
      } catch (err) {
        alert(err.message);
      }
    },
    [newCategoryName, addNewCategory, refreshCategories]
  );

  // 🔹 Modales de edición
  const openEditModal = useCallback((category) => {
    setEditingCategory(category);
    setEditCategoryName(category.nombre);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
    setEditCategoryName("");
  }, []);

  const confirmEdit = useCallback(async () => {
    if (!editCategoryName.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }
    if (editCategoryName === editingCategory?.nombre) {
      closeEditModal();
      return;
    }
    try {
      await modifiedCategory(editingCategory.id, editCategoryName);
      refreshCategories();
      closeEditModal();
    } catch (err) {
      alert(err.message);
    }
  }, [
    editCategoryName,
    editingCategory,
    modifiedCategory,
    refreshCategories,
    closeEditModal,
  ]);

  // 🔹 Modales de eliminación
  const openDeleteModal = useCallback((category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await removeCategory(deletingCategory.id);
      refreshCategories();
      closeDeleteModal();
    } catch (err) {
      alert(err.message);
      closeDeleteModal();
    }
  }, [deletingCategory, removeCategory, refreshCategories, closeDeleteModal]);

  // 🔹 Render tabla memorizada -> Componente central de CategoryManagement
  const renderedTable = useMemo(() => {
    if (categories.length === 0) {
      return (
        <div className="empty-categories">
          <p>No hay categorías registradas. ¡Crea la primera!</p>
        </div>
      );
    }

    return (
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
                  <FaEdit /> Editar
                </button>
                <button
                  className="btn-delete-cat"
                  onClick={() => openDeleteModal(category)}
                >
                  <FaTrashAlt /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [categories, openEditModal, openDeleteModal]);

  if (loading)
    return <div className="category-loading">Cargando categorías...</div>;
  if (error)
    return (
      <div className="category-error">
        Error al cargar las categorías: {error}
      </div>
    );

  return (
    <div className="category-container">
      <div className="category-header">
        <h1>Gestión de Categorías</h1>
      </div>
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

      {/* // Componente de tabla de categorias */}
      {renderedTable}
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
      {showSuccessToast && (
        <SuccessToast mensaje={"Categoría guardada exitosamente!"} />
      )}
    </div>
  );
};

export default React.memo(CategoryManagement);
