import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "../shared/Loader";
import { Modal } from "../shared/Modal";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";
import { MdOutlineCreate } from "react-icons/md";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./UsersManagement.css";

const UsersManagement = () => {
  const { users, loading, modifyUser, removeUser, fetchUsers } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // === Estados para el modal de edición ===
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserLastName, setEditUserLastName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editUserUsuario, setEditUserUsuario] = useState("");

  // === Estados para el modal de eliminación ===
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // === Funciones de edición ===
  const openEditModal = useCallback((user) => {
    setIsEditModalOpen(true);
    setEditingUser(user);
    setEditUserName(user.nombre);
    setEditUserLastName(user.apellido);
    setEditUserEmail(user.email);
    setEditUserPhone(user.telefono);
    setEditUserUsuario(user.usuario);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditUserName("");
    setEditUserLastName("");
    setEditUserEmail("");
    setEditUserPhone("");
    setEditUserUsuario("");
  }, []);

  const confirmEdit = useCallback(async () => {
    if (!editUserName.trim()) return alert("El nombre no puede estar vacío.");
    if (!editUserLastName.trim())
      return alert("El apellido no puede estar vacío.");
    if (!editUserEmail.trim()) return alert("El correo no puede estar vacío.");
    if (!editUserPhone.trim())
      return alert("El teléfono no puede estar vacío.");
    if (!editUserUsuario.trim())
      return alert("El usuario no puede estar vacío.");

    const data = {
      nombre: editUserName,
      apellido: editUserLastName,
      email: editUserEmail,
      telefono: editUserPhone,
      usuario: editUserUsuario,
      rol: editingUser.rol,
      activo: editingUser.activo,
    };

    try {
      await modifyUser(editingUser.id, data);
      await fetchUsers();
      closeEditModal();
    } catch (err) {
      alert(err.message);
    }
  }, [
    closeEditModal,
    modifyUser,
    fetchUsers,
    editingUser,
    editUserName,
    editUserLastName,
    editUserEmail,
    editUserPhone,
    editUserUsuario,
  ]);

  // === Funciones de eliminación ===
  const handleDeleteClick = useCallback((user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await removeUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  }, [userToDelete, fetchUsers, removeUser]);

  // === Render de tabla ===
  const renderTable = useMemo(() => {
    if (users.length === 0) {
      return (
        <div className="empty-users">
          <p>No hay usuarios registrados.</p>
          <Link to="/dashboard/users/new" className="btn-add-user">
            <MdOutlineCreate size={20} /> Crear primer usuario
          </Link>
        </div>
      );
    }

    return (
      <div className="users-table-wrapper">
        <table className="users-management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td data-label="ID">
                  <span className="user-id">#{user.id}</span>
                </td>
                <td data-label="Nombre">
                  <span className="user-name">{user.nombre}</span>
                </td>
                <td data-label="Apellido">
                  <span className="user-lastname">{user.apellido}</span>
                </td>
                <td data-label="Correo">
                  <span className="user-email">{user.email}</span>
                </td>
                <td data-label="Teléfono">
                  <span className="user-tel">{user.telefono}</span>
                </td>
                <td data-label="Usuario">
                  <span className="username">{user.usuario}</span>
                </td>
                <td data-label="Rol">
                  <span className="rol">{user.rol}</span>
                </td>
                <td data-label="Acciones" className="users-actions">
                  <button
                    className="btn-edit-user"
                    onClick={() => openEditModal(user)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    className="btn-delete-user"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <FaTrashAlt /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [users, handleDeleteClick, openEditModal]);

  // === Loader ===
  if (loading) {
    return (
      <div className="users-management-container">
        <div className="users-loading">
          Cargando lista de usuarios...
          <Loader />
        </div>
      </div>
    );
  }

  // === Render principal ===
  return (
    <div className="users-management-container">
      <div className="users-page-header">
        <h1>Lista de usuarios</h1>
        <Link to="/dashboard/users/new" className="btn-add-user">
          <MdOutlineCreate size={20} /> Agregar usuario
        </Link>
      </div>

      {renderTable}

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <Modal onClose={closeEditModal}>
          <div className="user-modal-content">
            <h2>✏️ Editar Usuario</h2>

            <label className="label-input">Nombre:</label>
            <input
              type="text"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
              className="user-modal-input"
              placeholder="Nombre del usuario"
              autoFocus
            />

            <label className="label-input">Apellido:</label>
            <input
              type="text"
              value={editUserLastName}
              onChange={(e) => setEditUserLastName(e.target.value)}
              className="user-modal-input"
              placeholder="Apellido del usuario"
            />

            <label className="label-input">Correo:</label>
            <input
              type="email"
              value={editUserEmail}
              onChange={(e) => setEditUserEmail(e.target.value)}
              className="user-modal-input"
              placeholder="Correo del usuario"
            />

            <label className="label-input">Teléfono:</label>
            <input
              type="tel"
              value={editUserPhone}
              onChange={(e) => setEditUserPhone(e.target.value)}
              className="user-modal-input"
              placeholder="Teléfono del usuario"
            />

            <label className="label-input">Usuario:</label>
            <input
              type="text"
              value={editUserUsuario}
              onChange={(e) => setEditUserUsuario(e.target.value)}
              className="user-modal-input"
              placeholder="Usuario del empleado"
            />

            <div className="user-modal-buttons">
              <button onClick={closeEditModal} className="btn-cancel-edit-user">
                Cancelar
              </button>
              <button onClick={confirmEdit} className="btn-confirm-edit-user">
                Guardar Cambios
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de eliminación */}
      {isDeleteModalOpen && (
        <Modal onClose={cancelDelete}>
          <div className="user-modal-content">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2>¿Eliminar usuario?</h2>

            <div className="user-delete-info">
              <p>
                <strong>Nombre:</strong>{" "}
                {`${userToDelete?.nombre} ${userToDelete?.apellido}`}
              </p>
              <p>
                <strong>Usuario:</strong> {userToDelete?.usuario}
              </p>
              <p>
                <strong>Correo:</strong> {userToDelete?.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {userToDelete?.telefono}
              </p>
              <p>
                <strong>Rol:</strong> {userToDelete?.rol}
              </p>
            </div>

            <p
              style={{ color: "#666", fontSize: "1rem", marginBottom: "1rem" }}
            >
              ¿Estás seguro de que quieres eliminar este usuario?
              <br />
              <span style={{ fontSize: "0.9rem", color: "#999" }}>
                Esta acción no se puede deshacer.
              </span>
            </p>

            <div className="user-modal-buttons">
              <button onClick={cancelDelete} className="btn-cancel-user">
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

export default React.memo(UsersManagement);
