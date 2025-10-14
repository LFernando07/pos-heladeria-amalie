const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createTables } = require("./src/database/createDB");
const { seedData } = require("./src/database/seedData");
const routerProducts = require("./src/modules/products/products.routes");
const routerSales = require("./src/modules/sales/sales.routes");
const routerCategories = require("./src/modules/categories/categories.routes");
const routerFlavours = require("./src/modules/flavours/flavours.routes");
const routerCategoryFlavours = require("./src/modules/categories-flavours/categories_flavours.routes");

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir imágenes
app.use("/images", express.static(path.join(__dirname, "images")));

// Crear carpeta de imágenes si no existe
const imageDir = path.join(__dirname, "images");
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

// CONFIGURACIÓN DE LA BASE DE DATOS Y SU DATA
createTables();
// seedData();

// CONFIGURACIÓN DE MULTER (SUBIDA DE IMÁGENES)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ENDPOINTS EXPRESS
app.use("/api/productos", routerProducts({ upload }));
app.use("/api/ventas", routerSales);
app.use("/api/categorias", routerCategories);
app.use("/api/sabores", routerFlavours);
app.use("/api/categorias-sabores", routerCategoryFlavours);

app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
