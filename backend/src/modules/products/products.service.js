const path = require("path");
const fs = require("fs");
const {
  createProductModel,
  getAllProductsModel,
  updateProductImageModel,
} = require("./products.model");

const getAllProductsService = (callback) => {
  getAllProductsModel((err, productos) => {
    if (err) return callback(err);

    if (!productos.length) return callback(null, []);

    callback(null, productos);
  });
};

const createProductService = (data, file, callback) => {
  // 3. Insertamos el producto en la BD con imagen pendiente
  createProductModel(data, (err, product) => {
    if (err) return callback(err);

    // 4. Obtenemos el ID del producto que acabamos de crear
    const nuevoId = product.id;
    let nombre = data.nombre;
    nombre = nombre.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const tempPath = file.path; // Ruta completa del archivo temporal
    const extension = ".png"; // Extensión del archivo original
    const nuevoNombreArchivo = `${nuevoId}_${nombre}${extension}`;

    // Construir la ruta al frontend/images desde la raíz del proyecto
    // Primero obtenemos la ruta del backend (donde está index.js)
    const backendRoot = path.join(__dirname, "..", "..", "..");
    const nuevaRutaCompleta = path.join(
      backendRoot,
      "..",
      "frontend",
      "images",
      nuevoNombreArchivo
    );
    const rutaParaBD = `./images/${nuevoNombreArchivo}`; // Ruta web para la BD

    // Verificar que el directorio de destino existe
    const dirDestino = path.dirname(nuevaRutaCompleta);
    if (!fs.existsSync(dirDestino)) {
      console.error("El directorio de destino NO existe:", dirDestino);
      return callback(new Error("El directorio de destino no existe"));
    }

    // 5. Renombramos el archivo de imagen
    fs.rename(tempPath, nuevaRutaCompleta, (err) => {
      if (err) {
        console.error("Error al renombrar el archivo:", err);
        console.error("Intentando copiar en lugar de mover...");

        // Intento alternativo: copiar y luego eliminar
        fs.copyFile(tempPath, nuevaRutaCompleta, (copyErr) => {
          if (copyErr) {
            console.error("Error al copiar:", copyErr);
            return callback(new Error("No se pudo guardar la imagen final."));
          }

          // Eliminar el archivo temporal
          fs.unlink(tempPath, (unlinkErr) => {
            if (unlinkErr)
              console.warn(
                "No se pudo eliminar el archivo temporal:",
                unlinkErr
              );
          });

          // Continuar con la actualización de la BD
          actualizarBD();
        });
        return;
      }

      actualizarBD();
    });

    function actualizarBD() {
      // 6. Actualizamos el registro en la BD con la ruta de imagen correcta
      updateProductImageModel(nuevoId, rutaParaBD, (err) => {
        if (err) {
          return callback(
            new Error("No se pudo actualizar la ruta de la imagen.")
          );
        }

        // 7. Todo salió bien, devolvemos el producto completo
        callback(null, {
          id: nuevoId,
          nombre: data.nombre,
          precio: data.precio,
          categoria_id: data.categoria_id,
          imagen: rutaParaBD,
          requiere_sabor: data.requiere_sabor,
        });
      });
    }
  });
};

module.exports = {
  getAllProductsService,
  createProductService,
};
