const {
  getAllFlavoursService,
  createFlavourService,
} = require("./flavours.service");

// Obtener todos los sabores
function getAllFlavours(req, res) {
  getAllFlavoursService((err, flavours) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: flavours });
  });
}

// Crear un nuevo sabor
function createFlavour(req, res) {
  const { nombre, disponible } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  createFlavourService({ nombre, disponible }, (err, flavour) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ success: true, ...flavour });
  });
}

module.exports = {
  getAllFlavours,
  createFlavour,
};
