const db = require("../../database/connection");

// Devuelve solo datos públicos (sin password)
function getAllUsersModel(callback) {
  const sql = `SELECT id, nombre, apellido, email, telefono, rol, usuario, activo, fecha_contratacion, fecha_creacion FROM empleados ORDER BY nombre`;
  db.all(sql, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

function getUserByIdModel(id, callback) {
  const sql = `SELECT id, nombre, apellido, email, telefono, rol, usuario, activo, fecha_contratacion, fecha_creacion FROM empleados WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

// Trae TODAS las columnas (incluyendo password) - útil para login
function getUserFullByUsernameModel(usuario, callback) {
  const sql = `SELECT * FROM empleados WHERE usuario = ?`;
  db.get(sql, [usuario], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

function createUserModel(user, callback) {
  const {
    nombre,
    apellido = null,
    email = null,
    telefono = null,
    rol = "despachador",
    usuario,
    password, // debe venir ya hasheado
    activo = 1,
  } = user;

  const sql = `
    INSERT INTO empleados (nombre, apellido, email, telefono, rol, usuario, password, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [nombre, apellido, email, telefono, rol, usuario, password, activo],
    function (err) {
      if (err) return callback(err);
      getUserByIdModel(this.lastID, (err2, row) => {
        if (err2) return callback(err2);
        callback(null, row);
      });
    }
  );
}

function updateUserModel(id, data, callback) {
  const { nombre, apellido, email, telefono, rol, usuario, activo } = data;
  const sql = `
    UPDATE empleados
    SET nombre = ?, apellido = ?, email = ?, telefono = ?, rol = ?, usuario = ?, activo = ?
    WHERE id = ?
  `;
  db.run(
    sql,
    [nombre, apellido, email, telefono, rol, usuario, activo, id],
    function (err) {
      if (err) return callback(err);
      callback(null, { updated: this.changes > 0 });
    }
  );
}

function updateUserPasswordModel(id, hashedPassword, callback) {
  const sql = `UPDATE empleados SET password = ? WHERE id = ?`;
  db.run(sql, [hashedPassword, id], function (err) {
    if (err) return callback(err);
    callback(null, { updated: this.changes > 0 });
  });
}

function deleteUserModel(id, callback) {
  const sql = `DELETE FROM empleados WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) return callback(err);
    callback(null, { deleted: this.changes > 0 });
  });
}

module.exports = {
  getAllUsersModel,
  getUserByIdModel,
  getUserFullByUsernameModel,
  createUserModel,
  updateUserModel,
  updateUserPasswordModel,
  deleteUserModel,
};
