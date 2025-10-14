// src/modules/products/product.routes.js
const express = require("express");
const { getAllProducts, createProduct } = require("./products.controller");

// Configurar almacenamiento de imágenes
module.exports = ({ upload }) => {
  const routerProducts = express.Router();
  // Rutas
  routerProducts.get("/", getAllProducts);

  // Usamos el `upload` que nos pasa index.js
  routerProducts.post("/", upload.single("imagen"), createProduct);

  return routerProducts;
};
