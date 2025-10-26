const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./categories.controller");

const routerCategories = express.Router();

// Obtener todas las categorías
routerCategories.get("/", getAllCategories);

// Obtener una categoría por ID
routerCategories.get("/:id", getCategoryById);

// Crear una nueva categoría
routerCategories.post("/", createCategory);

// Actualizar una categoría existente
routerCategories.put("/:id", updateCategory);

// Eliminar una categoría
routerCategories.delete("/:id", deleteCategory);

module.exports = routerCategories;
