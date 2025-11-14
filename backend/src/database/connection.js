const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta para buscar/generar la base de datos del backend
const dbPath = path.resolve(__dirname, "../../heladosamelie.db");

// Funcion para conectarse a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err.message);
  console.log("✅ Conectado a la base de datos heladosamelie.db");
});

module.exports = db;
