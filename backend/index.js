const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer'); // 1. Importar Multer
const path = require('path'); // 2. Importar path para manejar rutas de archivos
const fs = require('fs'); // 1. Importa el módulo File System


const app = express();
const PORT = 3001; // aquí se usa un puerto diferente al de la app de React

// Middlewares
app.use(cors()); // esto permite peticiones desde el front-end
app.use(express.json()); // esto permite al servidor entender JSON

// --- 3. SERVIR IMÁGENES ESTÁTICAMENTE ---
// Esto permite que el frontend acceda a las imágenes guardadas a través de una URL.
// La ruta que usaremos en el frontend será, por ejemplo, http://localhost:3001/images/nombre-de-imagen.png
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// --- 4. CONFIGURACIÓN DE MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La carpeta donde se guardarán las imágenes. Usamos path.join para crear una ruta relativa segura.
        const destinationPath = path.join(__dirname, '..', 'images');
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        /*const nombreProducto = req.body.nombre;
        const formatoNombre = nombreProducto.toLowerCase().replace(/[^a-z0-9]/g, '_');*/
        // Para evitar nombres de archivo duplicados, aqui se formatea.
        /*cb(null, `${formatoNombre}.jpg`);*/

        // 2. Guardamos el archivo con un nombre temporal único usando la fecha
        //    La extensión original se preserva para mayor flexibilidad (ej: .png, .jpeg)
        const tempName = Date.now() + path.extname(file.originalname);
        cb(null, tempName);
    }
});
const upload = multer({ storage: storage });

// aquí se conecta a la base de datos SQLite (creará el archivo si no existe)
const db = new sqlite3.Database('./heladeria.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la BD heladeria.sqlite.');
});

// se crean las tablas si no existen
db.serialize(() => {
    // Tabla para las ventas
    db.run(`CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        empleado TEXT,
        pagado REAL, 
        cambio REAL
    )`);

    // Tabla para los productos de cada venta
    db.run(`CREATE TABLE IF NOT EXISTS productos_venta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venta_id INTEGER,
        nombre_producto TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (venta_id) REFERENCES ventas(id)
    )`);
});

// --- este endpoint para OBTENER todos los productos del catálogo (de la BD) ---
app.get('/api/productos', (req, res) => {
    const query_productos = `SELECT * FROM catalogo_productos`;
    
    // db.all() ejecuta la consulta y devuelve todas las filas encontradas
    db.all(query_productos, [], (err, rows) => {
        if (err) {
            // Si hay un error, se enviamos en la respuesta
            res.status(500).json({ error: err.message });
            return;
        }
        // Por el contrario si sale bien, enviamos los productos como JSON
        res.json({
            message: 'Catálogo obtenido con éxito',
            data: rows
        });
    });
});

// --- este endpoint es para AÑADIR un nuevo producto al catálogo (con imagen) ---
app.post('/api/productos', upload.single('imagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '¡La imagen del producto es obligatoria!' });
    }
    const { nombre, precio, categoria } = req.body;

    // El path de la imagen para guardar en la BD. req.file es añadido por Multer.
    // Guardamos la ruta web, no la ruta del sistema de archivos.
    //const imagenPath = req.file ? `./images/${req.file.filename}` : null;

    if (!nombre || !precio || !categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

        // 3. Insertamos el producto en la BD, pero con un valor temporal para la imagen...
    const query_insert = `INSERT INTO catalogo_productos (nombre, precio, categoria, imagen) VALUES (?, ?, ?, ?)`;
    db.run(query_insert, [nombre, precio, categoria, 'pendiente...'], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // 4. Obtenemos el ID del producto que acabamos de crear
        const nuevoId = this.lastID;
        var nombre = req.body.nombre;
        nombre = nombre.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const tempPath = req.file.path; // Ruta completa del archivo temporal
        const extension = '.png'; // Extensión del archivo original
        const nuevoNombreArchivo = `${nuevoId}_${nombre}${extension}`; 
        const nuevaRutaCompleta = path.join(__dirname, '..', 'images', nuevoNombreArchivo);
        const rutaParaBD = `./images/${nuevoNombreArchivo}`; // Ruta web para la BD...

        // 5. Renombramos el archivo de imagen
        fs.rename(tempPath, nuevaRutaCompleta, (err) => {
            if (err) {
                // Si falla el renombrado, es importante manejar el error
                console.error("Error al renombrar el archivo:", err);
                return res.status(500).json({ error: 'No se pudo guardar la imagen final.' });
            }

            // 6. Actualizamos el registro en la BD con la ruta de imagen correcta
            const sqlUpdate = `UPDATE catalogo_productos SET imagen = ? WHERE id = ?`;
            db.run(sqlUpdate, [rutaParaBD, nuevoId], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'No se pudo actualizar la ruta de la imagen.' });
                }
                // 7. Todo salió bien, enviamos la respuesta exitosa
                res.status(201).json({
                    message: 'Producto añadido con éxito',
                    data: { id: nuevoId, nombre, precio, categoria, imagen: rutaParaBD }
                });
            });
        });
    });
});

// --- Endpoint para registrar una nueva venta ---
app.post('/api/ventas', (req, res) => {
    const { total, date, time, employee, pagado, cambio, products } = req.body;

    // Insertar la venta en la tabla 'ventas'
    const sqlVenta = `INSERT INTO ventas (total, fecha, hora, empleado, pagado, cambio) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sqlVenta, [total, date, time, employee, pagado, cambio], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const ventaId = this.lastID; // se obtiene el ID de la venta recién creada

        // se inserta cada producto en la tabla 'productos_venta'
        const sqlProducto = `INSERT INTO productos_venta (venta_id, nombre_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)`;
        products.forEach(product => {
            const subtotal = product.precio * product.cantidad;
            db.run(sqlProducto, [ventaId, product.nombre, product.cantidad, subtotal], (err) => {
                if (err) {
                    // aquí se debe manejar el error (ej. rollback)
                    console.error(err.message);
                }
            });
        });

        res.status(201).json({ message: 'Venta registrada con éxito', ventaId: ventaId });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});