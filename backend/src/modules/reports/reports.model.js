const db = require("../../database/connection");

function getSalesReportModel(callback) {
  const sql = `SELECT 
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
    ORDER BY v.id ASC`;

  db.all(sql, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

module.exports = {
  getSalesReportModel,
};
