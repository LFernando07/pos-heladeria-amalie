const db = require("../../database/connection");

// Obtener el conteo de ventas de una fecha específica
function getCountSalesModel(fecha, callback) {
  const countQuery = `SELECT COUNT(*) AS total FROM ventas WHERE fecha = ?`;

  db.get(countQuery, [fecha], (err, row) => {
    if (err) return callback(err);
    callback(null, row.total);
  });
}

// Crear una nueva venta en la BD
function createSaleModel(saleData, callback) {
  const { folio, total, fecha, hora, empleado_id, pagado, cambio } = saleData;

  const ventaQuery = `
    INSERT INTO ventas (folio, total, fecha, hora, empleado_id, pagado, cambio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    ventaQuery,
    [folio, total, fecha, hora, empleado_id, pagado, cambio],
    function (err) {
      if (err) return callback(err);
      callback(null, { ventaId: this.lastID, folio });
    }
  );
}

// Insertar productos asociados a una venta
function createSaleProductsModel(ventaId, productos, callback) {
  const productoQuery = `
    INSERT INTO productos_venta 
    (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const stmt = db.prepare(productoQuery);

  productos.forEach((p) => {
    stmt.run(
      ventaId,
      p.id,
      p.nombre,
      p.cantidad,
      p.precio,
      p.precio * p.cantidad
    );
  });

  stmt.finalize((err) => {
    if (err) return callback(err);
    callback(null, { success: true });
  });
}

module.exports = {
  getCountSalesModel,
  createSaleModel,
  createSaleProductsModel,
};
