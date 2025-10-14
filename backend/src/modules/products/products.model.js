const db = require("../../database/connection");

// Obtener todos los productos con sus sabores
function getAllProductsModel(callback) {
  const query = `
    SELECT 
      p.id, p.nombre, p.precio, p.imagen, p.requiere_sabor, p.disponible,
      c.nombre as categoria, c.id as categoria_id
    FROM productos p
    INNER JOIN categorias c ON p.categoria_id = c.id
    WHERE p.disponible = 1
    ORDER BY p.nombre
  `;

  db.all(query, [], (err, productos) => {
    if (err) return callback(err);
    callback(null, productos);
  });
}

// Crear un nuevo producto (inserción inicial con imagen pendiente)
function createProductModel(product, callback) {
  const { nombre, precio, categoria_id, requiere_sabor = 0 } = product;
  const sql = `
    INSERT INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [nombre, precio, categoria_id, "pendiente...", requiere_sabor],
    function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, ...product });
    }
  );
}

// Actualizar la ruta de la imagen del producto
function updateProductImageModel(productId, imagenPath, callback) {
  const sql = `UPDATE productos SET imagen = ? WHERE id = ?`;

  db.run(sql, [imagenPath, productId], function (err) {
    if (err) return callback(err);
    callback(null, { updated: true });
  });
}

module.exports = {
  getAllProductsModel,
  createProductModel,
  updateProductImageModel,
};
