const { getSalesReportModel } = require("./reports.model");

function getSalesReportService(startDate, endDate, callback) {
  getSalesReportModel((err, ventas) => {
    if (err) return callback(err);

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const filtered = ventas.filter((v) => {
      const saleDate = new Date(`${v.fecha}T00:00:00`);
      return saleDate >= start && saleDate <= end;
    });

    callback(null, filtered);
  });
}

module.exports = {
  getSalesReportService,
};
