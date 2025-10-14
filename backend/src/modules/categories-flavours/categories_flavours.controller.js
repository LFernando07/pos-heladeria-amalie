const {
  getAllCategoryFlavoursService,
  getFlavoursByCategoryService,
  createCategoryFlavourService,
  deleteCategoryFlavourService,
} = require("./categories_flavours.service");

// Obtener todas las relaciones categoría-sabor
function getAllCategoryFlavours(req, res) {
  getAllCategoryFlavoursService((err, relations) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: relations });
  });
}

// Obtener sabores de una categoría específica
function getFlavoursByCategory(req, res) {
  const categoryId = parseInt(req.params.id);

  getFlavoursByCategoryService(categoryId, (err, flavours) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: flavours });
  });
}

// Crear una nueva relación categoría-sabor
function createCategoryFlavour(req, res) {
  const { categoria_id, sabor_id } = req.body;

  if (!categoria_id || !sabor_id) {
    return res.status(400).json({
      error: "Faltan el ID de la categoría o del sabor",
    });
  }

  createCategoryFlavourService({ categoria_id, sabor_id }, (err, relation) => {
    if (err) {
      const statusCode = err.message === "Esta relación ya existe" ? 400 : 500;
      return res.status(statusCode).json({ error: err.message });
    }
    res.status(201).json({ success: true, ...relation });
  });
}

// Eliminar una relación categoría-sabor
function deleteCategoryFlavour(req, res) {
  const id = req.params.id;

  deleteCategoryFlavourService(id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      success: true,
      message: "Relación categoría-sabor eliminada correctamente",
    });
  });
}

module.exports = {
  getAllCategoryFlavours,
  getFlavoursByCategory,
  createCategoryFlavour,
  deleteCategoryFlavour,
};
