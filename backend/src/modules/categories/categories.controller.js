const {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} = require("./categories.service");

// Obtener todas las categorías
function getAllCategories(req, res) {
  getAllCategoriesService((err, categories) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: categories });
  });
}

// Obtener una categoría por ID
function getCategoryById(req, res) {
  const { id } = req.params;

  getCategoryByIdService(id, (err, category) => {
    if (err) {
      const statusCode = err.message === "Categoría no encontrada" ? 404 : 500;
      return res.status(statusCode).json({ error: err.message });
    }
    res.json({ success: true, data: category });
  });
}

// Crear una nueva categoría
function createCategory(req, res) {
  const { nombre, activo } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  createCategoryService({ nombre, activo }, (err, category) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ success: true, ...category });
  });
}

// Actualizar una categoría existente
function updateCategory(req, res) {
  const { id } = req.params;
  const { nombre, activo } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  updateCategoryService(id, { nombre, activo }, (err, category) => {
    if (err) {
      const statusCode = err.message === "Categoría no encontrada" ? 404 : 500;
      return res.status(statusCode).json({ error: err.message });
    }
    res.json({
      success: true,
      data: category,
      message: "Categoría actualizada correctamente",
    });
  });
}

// Eliminar una categoría
function deleteCategory(req, res) {
  const { id } = req.params;

  deleteCategoryService(id, (err, result) => {
    if (err) {
      const statusCode = err.message === "Categoría no encontrada" ? 404 : 500;
      return res.status(statusCode).json({ error: err.message });
    }
    res.json({ success: true, message: result.message });
  });
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
