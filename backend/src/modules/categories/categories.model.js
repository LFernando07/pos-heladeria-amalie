const db = require("../../database/connection");

// Obtener todas las categorías
function getAllCategoriesModel(callback) {
  const query = `SELECT * FROM categorias ORDER BY id DESC`;

  db.all(query, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// Obtener una categoría por ID
function getCategoryByIdModel(id, callback) {
  const query = `SELECT * FROM categorias WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error("Categoría no encontrada"));
    callback(null, row);
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

// Actualizar una categoría existente
function updateCategoryModel(id, categoryData, callback) {
  const { nombre, activo } = categoryData;

  // Primero verificar si existe
  getCategoryByIdModel(id, (err, category) => {
    if (err) return callback(err);

    const query = `UPDATE categorias SET nombre = ?, activo = ? WHERE id = ?`;

    db.run(query, [nombre, activo, id], function (err) {
      if (err) return callback(err);
      if (this.changes === 0) {
        return callback(new Error("No se pudo actualizar la categoría"));
      }
      callback(null, { id, nombre, activo });
    });
  });
}

// Eliminar una categoría
function deleteCategoryModel(id, callback) {
  // Primero verificar si existe
  getCategoryByIdModel(id, (err, category) => {
    if (err) return callback(err);

    const query = `DELETE FROM categorias WHERE id = ?`;

    db.run(query, [id], function (err) {
      if (err) {
        // Si hay productos asociados, el error será de constraint
        if (err.message.includes("FOREIGN KEY")) {
          return callback(
            new Error(
              "No se puede eliminar: hay productos asociados a esta categoría"
            )
          );
        }
        return callback(err);
      }
      if (this.changes === 0) {
        return callback(new Error("No se pudo eliminar la categoría"));
      }
      callback(null, { message: "Categoría eliminada correctamente" });
    });
  });
}

module.exports = {
  getAllCategoriesModel,
  getCategoryByIdModel,
  createCategoryModel,
  updateCategoryModel,
  deleteCategoryModel,
};
