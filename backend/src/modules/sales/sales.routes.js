const express = require("express");
const { createSale } = require("./sales.controller");

const routerSales = express.Router();

// Rutas
routerSales.post("/", createSale);

module.exports = routerSales;
