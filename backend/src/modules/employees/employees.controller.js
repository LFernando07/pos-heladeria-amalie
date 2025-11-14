// src/modules/employees/employees.controller.js
const {
  getAllUsersService,
  getUserByIdService,
  registerUserService,
  loginService,
  updateUserService,
  changePasswordService,
  deleteUserService,
} = require("./employees.service");

// =======================================================
// 🧍‍♂️ CONTROLADORES DE USUARIOS
// =======================================================

function getAllUsers(req, res) {
  getAllUsersService((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
}

function getUserById(req, res) {
  const { id } = req.params;
  getUserByIdService(id, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  });
}

function getMe(req, res) {
  res.json({ user: req.user });
}

function register(req, res) {
  const { nombre, usuario, password } = req.body;
  if (!nombre || !usuario || !password) {
    return res.status(400).json({ error: "Campos obligatorios" });
  }

  registerUserService(req.body, (err, user) => {
    if (err) {
      if (err.message && err.message.includes("UNIQUE"))
        return res.status(400).json({ error: "Usuario ya existe" });
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(user);
  });
}

function login(req, res) {
  const { usuario, password } = req.body;
  if (!usuario || !password)
    return res.status(400).json({ error: "Credenciales requeridas" });

  loginService(usuario, password, (err, result) => {
    if (err) return res.status(401).json({ error: err.message });
    const { token, user } = result;
    res.json({ token, user });
  });
}

function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada correctamente" });
}

function updateUser(req, res) {
  const { id } = req.params;
  updateUserService(id, req.body, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(user);
  });
}

function changePassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword)
    return res.status(400).json({ error: "Password requerido" });

  changePasswordService(id, newPassword, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Contraseña actualizada" });
  });
}

function deleteUser(req, res) {
  const { id } = req.params;
  deleteUserService(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario eliminado" });
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  getMe,
  register,
  login,
  logout,
  updateUser,
  changePassword,
  deleteUser,
};
