const path = require("path");
const fs = require("fs");
const {
  createProductModel,
  getAllProductsModel,
  updateProductImageModel,
  getProductByIdModel,
  updateProductModel,
  deleteProductModel,
} = require("./products.model");

// 📂 Ruta donde se guardarán las imágenes
const imageDir = path.join(__dirname, "../../../images");

// Asegurar que la carpeta exista
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const getAllProductsService = (callback) => {
  getAllProductsModel((err, productos) => {
    if (err) return callback(err);

    if (!productos.length) return callback(null, []);

    callback(null, productos);
  });
};

const getProductByIdService = (id, callback) => {
  getProductByIdModel(id, (err, producto) => {
    if (err) return callback(err);
    if (!producto) return callback(new Error("Producto no encontrado"));
    callback(null, producto);
  });
};

const createProductService = (data, file, callback) => {
  createProductModel(data, (err, product) => {
    if (err) return callback(err);

    // 💡 Aseguramos que el ID sea numérico y real
    const nuevoId = Number(product.id);
    if (!nuevoId || isNaN(nuevoId))
      return callback(
        new Error("No se pudo obtener el ID del nuevo producto.")
      );

    const nombreNormalizado = data.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");

    const extension = path.extname(file.originalname) || ".png";
    const nuevoNombreArchivo = `${nuevoId}_${nombreNormalizado}${extension}`;
    const destinoCompleto = path.join(imageDir, nuevoNombreArchivo);
    const rutaParaBD = `./images/${nuevoNombreArchivo}`;

    fs.rename(file.path, destinoCompleto, (err) => {
      if (err) {
        console.error("Error al mover archivo:", err);
        return callback(new Error("No se pudo guardar la imagen."));
      }

      updateProductImageModel(nuevoId, rutaParaBD, (err) => {
        if (err) return callback(err);

        callback(null, {
          id: nuevoId,
          nombre: data.nombre,
          precio: data.precio,
          categoria_id: data.categoria_id,
          requiere_sabor: data.requiere_sabor,
          imagen: rutaParaBD,
        });
      });
    });
  });
};

const updateProductService = (id, data, file, callback) => {
  getProductByIdModel(id, (err, productoExistente) => {
    if (err) return callback(err);
    if (!productoExistente)
      return callback(new Error("Producto no encontrado"));

    const nombreNormalizado = (data.nombre || productoExistente.nombre)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");

    // ⚙️ 1. Si NO hay archivo nuevo → solo actualizar datos
    if (!file) {
      updateProductModel(id, data, (err, result) => {
        if (err) return callback(err);
        if (!result.updated)
          return callback(new Error("No se realizaron cambios"));
        return callback(null, { success: true });
      });
      return;
    }

    // ⚙️ 2. Si HAY archivo nuevo → reemplazar imagen
    const extension = path.extname(file.originalname) || ".png";
    const nuevoNombreArchivo = `${id}_${nombreNormalizado}${extension}`;
    const destinoCompleto = path.join(imageDir, nuevoNombreArchivo);
    const rutaParaBD = `./images/${nuevoNombreArchivo}`;

    // 🧹 Eliminar imagen vieja si existe
    if (productoExistente.imagen) {
      const rutaVieja = path.join(
        __dirname,
        "../../../images",
        productoExistente.imagen.replace("./", "")
      );
      if (fs.existsSync(rutaVieja)) {
        fs.unlinkSync(rutaVieja);
      }
    }

    // 💾 Guardar nueva imagen en disco
    fs.rename(file.path, destinoCompleto, (err) => {
      if (err) return callback(new Error("Error al guardar la nueva imagen"));

      // 🔄 Actualizar imagen en BD
      updateProductImageModel(id, rutaParaBD, (err) => {
        if (err) return callback(err);

        // Si hay otros datos además de la imagen → actualízalos también
        if (data && Object.keys(data).length > 0) {
          updateProductModel(id, data, (err, result) => {
            if (err) return callback(err);
            return callback(null, { success: true });
          });
        } else {
          // Solo se cambió la imagen
          return callback(null, { success: true });
        }
      });
    });
  });
};

const deleteProductService = (id, callback) => {
  getProductByIdModel(id, (err, producto) => {
    if (err) return callback(err);
    if (!producto) return callback(new Error("Producto no encontrado"));

    // 🧹 Eliminar registro de la BD
    deleteProductModel(id, (err, result) => {
      if (err) return callback(err);
      if (!result.deleted)
        return callback(new Error("No se pudo eliminar el producto"));

      // 🗑️ Eliminar imagen física
      if (producto.imagen) {
        const rutaFisica = path.resolve(
          __dirname,
          "../../../",
          producto.imagen
        );

        if (fs.existsSync(rutaFisica)) {
          fs.unlinkSync(rutaFisica);
        } else {
        }
      }

      callback(null, { success: true });
    });
  });
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
