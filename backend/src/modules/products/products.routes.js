// src/modules/products/product.routes.js
const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./products.controller");

// Configurar almacenamiento de imágenes
module.exports = ({ upload }) => {
  const routerProducts = express.Router();
  // Rutas
  routerProducts.get("/", getAllProducts);
  routerProducts.get("/:id", getProductById);
  routerProducts.post("/", upload.single("imagen"), createProduct);
  routerProducts.put("/:id", updateProduct);
  routerProducts.delete("/:id", deleteProduct);

  return routerProducts;
};
