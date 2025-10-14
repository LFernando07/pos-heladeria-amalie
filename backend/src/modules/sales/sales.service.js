const {
  createSaleModel,
  getCountSalesModel,
  createSaleProductsModel,
} = require("./sales.model");

const createSaleService = (saleData, callback) => {
  const { total, fecha, hora, empleado_id, pagado, cambio, productos } =
    saleData;

  // Compactar fecha para formato del folio
  const fechaCompacta = fecha.replace(/-/g, "");

  // 1️⃣ Obtener cuántas ventas existen hoy
  getCountSalesModel(fecha, (err, totalVentas) => {
    if (err) return callback(err);

    // 2️⃣ Calcular el siguiente número secuencial
    const siguiente = (totalVentas + 1).toString().padStart(6, "0");
    const folio = `VTA-${fechaCompacta}-${siguiente}`;

    // 3️⃣ Insertar la venta con el folio generado
    const ventaData = {
      folio,
      total,
      fecha,
      hora,
      empleado_id,
      pagado,
      cambio,
    };

    createSaleModel(ventaData, (err, result) => {
      if (err) return callback(err);

      const { ventaId } = result;

      // 4️⃣ Insertar los productos asociados a la venta
      createSaleProductsModel(ventaId, productos, (err) => {
        if (err) return callback(err);
        callback(null, { ventaId, folio });
      });
    });
  });
};

module.exports = {
  createSaleService,
};
