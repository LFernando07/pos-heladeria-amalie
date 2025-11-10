const express = require("express");
const {
  createSale,
  getAllSales,
  getSaleDetails,
} = require("./sales.controller");

const routerSales = express.Router();

routerSales.post("/", createSale); // Crear venta
routerSales.get("/", getAllSales); // Historial ventas
routerSales.get("/:id", getSaleDetails); // Detalles venta

module.exports = routerSales;
