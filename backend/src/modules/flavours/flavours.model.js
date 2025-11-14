const db = require("../../database/connection");

// Obtener todos los sabores
function getAllFlavoursModel(callback) {
  const query = `SELECT * FROM sabores ORDER BY id DESC`;

  db.all(query, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// Crear un nuevo sabor
function createFlavourModel(flavourData, callback) {
  const { nombre, disponible } = flavourData;
  const query = `INSERT INTO sabores (nombre, disponible) VALUES (?, ?)`;

  db.run(query, [nombre, disponible ?? 1], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, nombre, disponible: disponible ?? 1 });
  });
}

module.exports = {
  getAllFlavoursModel,
  createFlavourModel,
};
