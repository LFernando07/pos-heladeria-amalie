/*ESTE COMPONENTE ES EL QUE SE COLOCA EN LA SECCIÓN 'categorias' DEL DASHBOARD
Y CONSUME 'categories.service.js' y 'useCategories.js' */


import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { createCategory, updateCategory, deleteCategory } from '../../services/category.service';
import { AiOutlineFolderAdd } from 'react-icons/ai';
import './CategoryManagement.css'; 

const CategoryManagement = () => {
  const { categories, loading, error, refreshCategories } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }
    try {
      await createCategory(newCategoryName);
      setNewCategoryName(''); // Limpia el input
      refreshCategories(); // Actualiza la lista
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditCategory = async (id, currentName) => {
    const newName = prompt("Edita el nombre de la categoría:", currentName);
    if (newName && newName.trim() && newName !== currentName) {
      try {
        await updateCategory(id, newName);
        refreshCategories();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        await deleteCategory(id);
        refreshCategories();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>Error al cargar las categorías: {error}</p>;

  return (
    <div className="management-container">
      <div className="page-header">
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
        <button type="submit" className="btn-add">Agregar Categoría <AiOutlineFolderAdd size={30}/></button>
      </form>

      {/* Tabla de categorías existentes */}
      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.nombre}</td>
              <td className="actions-cell">
                <button
                  className="btn-edit"
                  onClick={() => handleEditCategory(category.id, category.nombre)}
                >
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;