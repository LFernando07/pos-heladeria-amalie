const db = require("../../database/connection");

// Obtener todas las categorías
function getAllCategoriesModel(callback) {
  const query = `SELECT * FROM categorias ORDER BY id DESC`;

  db.all(query, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// Crear una nueva categoría
function createCategoryModel(categoryData, callback) {
  const { nombre, activo } = categoryData;
  const query = `INSERT INTO categorias (nombre, activo) VALUES (?, ?)`;

  db.run(query, [nombre, activo ?? 1], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, nombre, activo: activo ?? 1 });
  });
}

module.exports = {
  getAllCategoriesModel,
  createCategoryModel,
};
