const db = require("./connection");

// Funcion para crear el Schema de la base de datos para el backend
const createTables = () => {
  db.serialize(() => {
    // CATEGORÍAS
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      activo INTEGER DEFAULT 1,
      fecha_creacion TEXT DEFAULT (datetime('now', 'localtime'))
    )`);

    // SABORES
    db.run(`CREATE TABLE IF NOT EXISTS sabores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      disponible INTEGER DEFAULT 1,
      imagen TEXT,
      fecha_creacion TEXT DEFAULT (datetime('now', 'localtime'))
    )`);

    // CATEGORÍAS-SABORES (Relación N:N)
    // Se genera una tabla intermedia
    // Enlazamos los sabores que tendra cada categoria desde el backend
    db.run(`CREATE TABLE IF NOT EXISTS categorias_sabores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria_id INTEGER NOT NULL,
      sabor_id INTEGER NOT NULL,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
      FOREIGN KEY (sabor_id) REFERENCES sabores(id) ON DELETE CASCADE,
      UNIQUE(categoria_id, sabor_id)
  )`);

    // PRODUCTOS
    // Se usa una FK de la categoria para obtener su informacion
    // Se agrego un campo de require_sabor como swith en el frontend
    db.run(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      categoria_id INTEGER,
      imagen TEXT,
      requiere_sabor INTEGER DEFAULT 0,
      disponible INTEGER DEFAULT 1,
      fecha_creacion TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
  )`);

    // EMPLEADOS
    // TODO: Tabla creada sin ser usada hasta la creacion de modulo de autenticación
    db.run(`CREATE TABLE IF NOT EXISTS empleados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT,
      email TEXT UNIQUE,
      telefono TEXT,
      rol TEXT DEFAULT 'despachador',
      usuario TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      activo INTEGER DEFAULT 1,
      fecha_contratacion TEXT DEFAULT (datetime('now', 'localtime')),
      fecha_creacion TEXT DEFAULT (datetime('now', 'localtime'))
  )`);

    // VENTAS
    // Se utiliza el folio como segunda clave candidata
    // Se usa el empleado_id como campo para referencear quien realizo la venta
    // TODO: sea dinamico hasta la creacion de modulo de autenticación
    db.run(`CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folio TEXT UNIQUE,
      total REAL NOT NULL,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL,
      empleado_id INTEGER,
      pagado REAL,
      cambio REAL,
      fecha_creacion TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (empleado_id) REFERENCES empleados(id)
  )`);

    // PRODUCTOS_VENTA
    db.run(`CREATE TABLE IF NOT EXISTS productos_venta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venta_id INTEGER,
      producto_id INTEGER NOT NULL,
      nombre_producto TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
  )`);
  });
};
module.exports = { createTables };
