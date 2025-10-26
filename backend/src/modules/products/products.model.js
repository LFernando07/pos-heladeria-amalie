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

// Obtener un producto por ID
function getProductByIdModel(id, callback) {
  const query = `
    SELECT 
      p.id, p.nombre, p.precio, p.imagen, p.requiere_sabor, p.disponible,
      c.nombre as categoria, c.id as categoria_id
    FROM productos p
    INNER JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?
  `;
  db.get(query, [id], (err, producto) => {
    if (err) return callback(err);
    callback(null, producto);
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

// Actualizar datos del producto
function updateProductModel(id, data, callback) {
  const { nombre, precio, categoria_id, requiere_sabor, disponible } = data;
  const sql = `
    UPDATE productos
    SET nombre = ?, precio = ?, categoria_id = ?, requiere_sabor = ?, disponible = ?
    WHERE id = ?
  `;
  db.run(
    sql,
    [nombre, precio, categoria_id, requiere_sabor, disponible, id],
    function (err) {
      if (err) return callback(err);
      callback(null, { updated: this.changes > 0 });
    }
  );
}

// Eliminar producto
function deleteProductModel(id, callback) {
  const sql = `DELETE FROM productos WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) return callback(err);
    callback(null, { deleted: this.changes > 0 });
  });
}

module.exports = {
  getAllProductsModel,
  getProductByIdModel,
  createProductModel,
  updateProductImageModel,
  updateProductModel,
  deleteProductModel,
};
