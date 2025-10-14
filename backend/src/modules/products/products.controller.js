const {
  getAllProductsService,
  createProductService,
} = require("./products.service");

// Obtener todos los productos
function getAllProducts(req, res) {
  getAllProductsService((err, productos) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: productos });
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

module.exports = {
  getAllProducts,
  createProduct,
};
