const {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("./products.service");

// Obtener todos los productos
function getAllProducts(req, res) {
  getAllProductsService((err, productos) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: productos });
  });
}

// Obtener por ID
function getProductById(req, res) {
  const { id } = req.params;
  getProductByIdService(id, (err, producto) => {
    if (err)
      return res.status(404).json({ success: false, error: err.message });
    res.json({ success: true, data: producto });
  });
}

// Crear un nuevo producto
function createProduct(req, res) {
  // Validar que existe la imagen
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "¡La imagen del producto es obligatoria!" });
  }

  const { nombre, precio, categoria_id, requiere_sabor } = req.body;

  // Validar campos obligatorios
  if (!nombre || !precio || !categoria_id) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  const newProduct = { nombre, precio, categoria_id, requiere_sabor };

  createProductService(newProduct, req.file, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "Producto añadido con éxito",
      success: true,
      data: product,
    });
  });
}

// Actualizar
function updateProduct(req, res) {
  const { id } = req.params;
  const data = req.body;
  updateProductService(id, data, (err, result) => {
    if (err)
      return res.status(400).json({ success: false, error: err.message });
    res.json({ success: true, message: "Producto actualizado correctamente" });
  });
}

// Eliminar
function deleteProduct(req, res) {
  const { id } = req.params;
  deleteProductService(id, (err, result) => {
    if (err)
      return res.status(404).json({ success: false, error: err.message });
    res.json({ success: true, message: "Producto eliminado con éxito" });
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
