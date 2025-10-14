const {
  getAllCategoriesService,
  createCategoryService,
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

module.exports = {
  getAllCategories,
  createCategory,
};
