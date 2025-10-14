const { createSaleService } = require("./sales.service");

// Crear una nueva venta
function createSale(req, res) {
  const fecha = new Date().toISOString().split("T")[0];
  const hora = new Date().toTimeString().split(" ")[0].slice(0, 5);

  const saleData = {
    ...req.body,
    fecha,
    hora,
  };

  createSaleService(saleData, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.status(201).json({
      success: true,
      ventaId: result.ventaId,
      folio: result.folio,
    });
  });
}

module.exports = {
  createSale,
};
