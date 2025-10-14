const db = require("./connection");

// Funcion para crear la data inicial dentro de la base de datos
const seedData = () => {
  db.serialize(() => {
    // Data de categorias
    // Sodas: Hace referencia a (SODAS ITALIANAS y otras)
    db.run(`INSERT OR IGNORE INTO categorias (nombre) VALUES 
    ('Comida'),
    ('Postres'),
    ('Botanas'),
    ('Helados'),
    ('Sodas'), 
    ('Frappés'),
    ('Malteadas')
   `);

    // Data de sabores
    // Se incluyen los sabores de la heladeria
    // Se incluyen las rutas de la imagen
    db.run(`INSERT OR IGNORE INTO sabores (nombre,imagen) VALUES 
    ('Fresa','./images/sabores/fresa.png'),
    ('Chocolate','./images/sabores/chocolate.png'),
    ('Vainilla','./images/sabores/vainilla.png'),
    ('Frambuesa','./images/sabores/frambuesa.png'),
    ('Blueberrys','./images/sabores/blueberrys.png'),
    ('Grosella','./images/sabores/grosella.png'),
    ('Fruta de Dragón','./images/sabores/fruta_dragon.png'),
    ('Manzana Verde','./images/sabores/manzana_verde.png'),
    ('Chicle','./images/sabores/chicle.png'),
    ('Café','./images/sabores/cafe.png'),
    ('Taro','./images/sabores/taro.png'),
    ('Moka Blanco','./images/sabores/moka_blanco.png'),
    ('Choco Menta','./images/sabores/choco_menta.png'),
    ('Yogurt Griego','./images/sabores/yogurt.png'),
    ('Chocolate Oscuro','./images/sabores/chocolate_oscuro.png'),
    ('Carbon Activado','./images/sabores/carbon_activado.png')
    `);

    // Helados → todos los sabores excepto Kiwi
    db.run(`INSERT OR IGNORE INTO categorias_sabores (categoria_id, sabor_id)
    SELECT 4, id FROM sabores
    `);

    // Sodas → Sabores de las sodas italianas
    db.run(`INSERT OR IGNORE INTO categorias_sabores (categoria_id, sabor_id)
    SELECT 5, id FROM sabores WHERE nombre IN ('Blueberryes', 'Grosella', 'Frambuesa' ,'Fresa','Fruta de Dragón','Manzana Verde','Chicle','Kiwi')
    `);

    // Malteadas→ solo 3 sabores basicos
    db.run(`INSERT OR IGNORE INTO categorias_sabores (categoria_id, sabor_id)
    SELECT 7, id FROM sabores WHERE nombre IN ('Vainilla', 'Chocolate', 'Fresa')
    `);

    // Frappé → Sabores de los frappes
    db.run(`INSERT OR IGNORE INTO categorias_sabores (categoria_id, sabor_id)
    SELECT 6, id FROM sabores WHERE nombre IN ('Café', 'Taro', 'Moka Blanco','Choco Menta','Yogurt Griego','Chocolate Oscuro','Carbón Activado')
    `);

    // Data de productos
    // COMIDA
    db.run(`INSERT OR IGNORE INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor) VALUES
    ('Nachos', 35.00, 1, './images/1_nachos.png', 0),
    ('Maruchan', 20.00, 1, './images/2_maruchan.png', 0),
    ('Ramen', 60.00, 1, './images/3_ramen.png', 0),
    ('Dumplings', 80.00, 1, './images/4_dumplings.png', 0)
    `);

    // POSTRES
    db.run(`INSERT OR IGNORE INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor) VALUES
    ('Cheesecake', 35.00, 2, './images/5_cheesecake.png', 0),
    ('Galletas con chispas', 20.00, 2, './images/6_galletas_chispas.png', 0),
    ('Muffins', 20.00, 2, './images/7_muffins.png', 0),
    ('Mini hot cakes 12 pz', 25.00, 2, './images/8_mini_hot_cakes.png', 0),
    ('Mini hot cakes 18 pz', 35.00, 2, './images/8_mini_hot_cakes.png', 0)
    `);

    // BOTANAS
    db.run(`INSERT OR IGNORE INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor) VALUES
    ('Papitas', 20.00, 3, './images/9_papitas.png', 0),
    ('Dulces', 15.00, 3, './images/10_dulces.png', 0)
    `);

    // HELADOS
    db.run(`INSERT OR IGNORE INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor) VALUES
    ('Cono sencillo', 15.00, 4, './images/11_cono_sencillo.png', 1),
    ('Cono de sabor', 18.00, 4, './images/12_cono_sabor.png', 1),
    ('Cono grande vainilla', 30.00, 4, './images/13_cono_grande_vainilla.png', 0),
    ('Cono grande de chocolate', 35.00, 4, './images/14_cono_grande_chocolate.png', 0),
    ('Vaso chico', 15.00, 4, './images/15_vaso_chico.png', 1),
    ('Vaso grande', 40.00, 4, './images/16_vaso_grande.png', 1),
    ('Sandwich', 15.00, 4, './images/17_sandwich.png', 0)
  `);

    // SODA ITALIANA
    db.run(`INSERT OR IGNORE INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor) VALUES
    ('Soda Italiana', 40.00, 5, './images/18_soda_italiana.png', 1)
  `);

    // FRAPPÉS
    db.run(`INSERT OR IGNORE INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor) VALUES
    ('Frappe', 40.00, 6, './images/19_frappe.png', 1)
  `);

    // MALTEADAS
    db.run(`INSERT OR IGNORE INTO productos (nombre, precio, categoria_id, imagen, requiere_sabor) VALUES
    ('Malteada', 45.00, 7, './images/20_malteada.png', 1)
  `);
  });
};

module.exports = { seedData };
