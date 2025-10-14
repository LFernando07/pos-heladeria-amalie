const db = require("../../database/connection");

// Obtener todas las relaciones categoría-sabor
function getAllCategoryFlavoursModel(callback) {
  const query = `
    SELECT cs.id, c.nombre AS categoria, s.nombre AS sabor
    FROM categorias_sabores cs
    INNER JOIN categorias c ON c.id = cs.categoria_id
    INNER JOIN sabores s ON s.id = cs.sabor_id
    ORDER BY c.nombre, s.nombre
  `;

  db.all(query, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// Obtener sabores de una categoría específica
function getFlavoursByCategoryModel(categoryId, callback) {
  const query = `
    SELECT s.nombre, s.imagen
    FROM categorias_sabores cs
    INNER JOIN categorias c ON c.id = cs.categoria_id
    INNER JOIN sabores s ON s.id = cs.sabor_id
    WHERE c.id = ?
  `;

  db.all(query, [categoryId], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// Verificar si ya existe una relación
function checkCategoryFlavourExistsModel(categoria_id, sabor_id, callback) {
  const query = `SELECT id FROM categorias_sabores WHERE categoria_id = ? AND sabor_id = ?`;

  db.get(query, [categoria_id, sabor_id], (err, row) => {
    if (err) return callback(err);
    callback(null, !!row); // Devuelve true si existe, false si no
  });
}

// Crear una nueva relación categoría-sabor
function createCategoryFlavourModel(data, callback) {
  const { categoria_id, sabor_id } = data;
  const query = `INSERT INTO categorias_sabores (categoria_id, sabor_id) VALUES (?, ?)`;

  db.run(query, [categoria_id, sabor_id], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, categoria_id, sabor_id });
  });
}

// Eliminar una relación categoría-sabor
function deleteCategoryFlavourModel(id, callback) {
  const query = `DELETE FROM categorias_sabores WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) return callback(err);
    callback(null, { deleted: true });
  });
}

module.exports = {
  getAllCategoryFlavoursModel,
  getFlavoursByCategoryModel,
  checkCategoryFlavourExistsModel,
  createCategoryFlavourModel,
  deleteCategoryFlavourModel,
};
