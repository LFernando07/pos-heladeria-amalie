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

const db = require("./src/database/connection");

//------------CAMBIOS AGREGADOS PARA MANEJAR TODO LO QUE NECESITA  EL DASHBOARD... ----------------------------------------------------
// PUT /api/productos/:id (Para Editar)
app.put('/api/productos/:id', upload.single('imagen'), (req, res) => {
    const { nombre, precio, categoria } = req.body;
    const imagenPath = req.file ? `/images/${req.file.filename}` : req.body.imagen; // Conserva la imagen si no se sube una nueva

    const sql = `UPDATE catalogo_productos SET nombre = ?, precio = ?, categoria = ?, imagen = ? WHERE id = ?`;
    db.run(sql, [nombre, precio, categoria, imagenPath, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto actualizado", changes: this.changes });
    });
});
// DELETE /api/productos/:id (Para Eliminar)
app.delete('/api/productos/:id', (req, res) => {
    // Opcional: añadir lógica para eliminar el archivo de imagen
    const sql = `DELETE FROM catalogo_productos WHERE id = ?`;
    db.run(sql, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto eliminado", changes: this.changes });
    });
});



// --- ENDPOINTS DE CATEGORÍAS (CRUD COMPLETO) ---

// GET /api/categorias (Obtener todas)
app.get('/api/categorias', (req, res) => {
    db.all(`SELECT * FROM categorias ORDER BY nombre`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// POST /api/categorias (Crear una nueva)
app.post('/api/categorias', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio.' });
    
    db.run(`INSERT INTO categorias (nombre) VALUES (?)`, [nombre], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, nombre });
    });
});

// PUT /api/categorias/:id (Actualizar una existente)
app.put('/api/categorias/:id', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio.' });

    db.run(`UPDATE categorias SET nombre = ? WHERE id = ?`, [nombre, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Categoría actualizada", changes: this.changes });
    });
});

// DELETE /api/categorias/:id (Eliminar una)
app.delete('/api/categorias/:id', (req, res) => {
    db.run(`DELETE FROM categorias WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Categoría eliminada", changes: this.changes });
    });
});



// --- ENDPOINT DE VENTAS ---
// GET /api/ventas (Para obtener todo el historial)
app.get('/api/ventas', (req, res) => {
    // Este query trae todas las ventas, podrías añadir JOINs para más detalles
    db.all(`SELECT * FROM ventas ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
//PARA OBTENER LOS DETALLES DE UNA VENTA ESPECÍFICA
app.get('/api/ventas/:id', (req, res) => {
    // La consulta busca en la tabla de productos vendidos, filtrando por el ID de la venta
    const sql = `
        SELECT pv.nombre_producto, pv.cantidad, pv.subtotal
        FROM productos_venta pv
        WHERE pv.venta_id = ?`;
    
    // req.params.id contiene el número que viene en la URL (ej. "20")
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});


// ------------ ENDPOINT PARA REPORTES DE VENTAS POR FECHA ---------------------------
app.get('/api/reports/sales', (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Se requieren fecha de inicio y fecha de fin.' });
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`); // incluimos todo el día

    const sql = `SELECT id, fecha, hora, total, pagado, cambio, empleado_id FROM ventas ORDER BY id ASC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }

        const filteredRows = rows.filter(sale => {
            // Si viene como YYYY-MM-DD
            const saleDate = new Date(`${sale.fecha}T00:00:00`);
            return saleDate >= start && saleDate <= end;
        });

        res.json({ data: filteredRows });
    });
});




// --- ENDPOINT PARA ENVIAR REPORTE POR CORREO ---
app.post('/api/reports/email', upload.single('report'), (req, res) => {
    const { to, subject, body } = req.body;
    
    // 1. Configura el "transportador" de correo.
    //    Aquí usamos Gmail como ejemplo. Necesitarás crear una "Contraseña de aplicación".
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jpgjake03@gmail.com',
            pass: 'nkig byee kfss xrdi' // ¡NO tu contraseña normal!
        }
    });

    // 2. Define las opciones del correo
    const mailOptions = {
        from: 'jpgjake03@gmail.com',
        to: to,
        subject: subject,
        html: body,
        attachments: [
            {
                filename: req.file.originalname,
                path: req.file.path // Nodemailer adjuntará el archivo subido
            }
        ]
    };

    // 3. Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Correo enviado: ' + info.response);
    });
});


//-----------------------------------------------------------------------------------------------------------------------

app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);

