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

// Obtener historial de ventas
function getAllSalesModel(callback) {
  const sql = `
    SELECT 
      v.id,
      v.folio,
      v.total,
      v.fecha,
      v.hora,
      v.pagado,
      v.cambio,
      v.empleado_id,
      (e.nombre || ' ' || e.apellido) AS empleado_nombre
    FROM ventas v
    LEFT JOIN empleados e ON v.empleado_id = e.id
    ORDER BY v.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// Obtener detalles de una venta específica
function getSaleDetailsModel(ventaId, callback) {
  const sql = `
    SELECT pv.nombre_producto, pv.cantidad, pv.subtotal
    FROM productos_venta pv
    WHERE pv.venta_id = ?
  `;

  db.all(sql, [ventaId], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

module.exports = {
  getCountSalesModel,
  createSaleModel,
  createSaleProductsModel,
  getAllSalesModel,
  getSaleDetailsModel,
};
