// src/modules/employees/employees.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  getAllUsersModel,
  getUserByIdModel,
  getUserFullByUsernameModel,
  createUserModel,
  updateUserModel,
  updateUserPasswordModel,
  deleteUserModel,
} = require("./employees.model");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

// =======================================================
// 🧠 Servicios
// =======================================================

// Obtener todos los usuarios
const getAllUsersService = (callback) => getAllUsersModel(callback);

// Obtener un usuario por ID
const getUserByIdService = (id, callback) => getUserByIdModel(id, callback);

// Registro de usuario (solo admin)
const registerUserService = (userData, callback) => {
  const { password } = userData;
  bcrypt.hash(password, 10, (err, hashed) => {
    if (err) return callback(err);
    const userToCreate = { ...userData, password: hashed };
    createUserModel(userToCreate, callback);
  });
};

// Login de usuario
const loginService = (usuario, password, callback) => {
  getUserFullByUsernameModel(usuario, (err, user) => {
    if (err) return callback(err);
    if (!user) return callback(new Error("Credenciales inválidas"));

    bcrypt.compare(password, user.password, (errCmp, same) => {
      if (errCmp) return callback(errCmp);
      if (!same) return callback(new Error("Credenciales inválidas"));

      // Token JWT
      const payload = {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol,
        email: user.email,
        nombre: user.nombre + " " + user.apellido,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      callback(null, { token, user: payload });
    });
  });
};

// Actualizar usuario
const updateUserService = (id, data, callback) => {
  updateUserModel(id, data, (err, result) => {
    if (err) return callback(err);
    if (!result.updated) return callback(new Error("Usuario no encontrado"));
    getUserByIdModel(id, callback);
  });
};

// Cambiar contraseña
const changePasswordService = (id, newPassword, callback) => {
  bcrypt.hash(newPassword, 10, (err, hashed) => {
    if (err) return callback(err);
    updateUserPasswordModel(id, hashed, callback);
  });
};

// Eliminar usuario
const deleteUserService = (id, callback) => deleteUserModel(id, callback);

module.exports = {
  getAllUsersService,
  getUserByIdService,
  registerUserService,
  loginService,
  updateUserService,
  changePasswordService,
  deleteUserService,
  JWT_SECRET,
  JWT_EXPIRES,
};
