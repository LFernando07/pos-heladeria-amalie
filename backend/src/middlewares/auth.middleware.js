const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../modules/employees/employees.service");

function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== role) {
      return res
        .status(403)
        .json({ error: "Acceso denegado. Solo administradores." });
    }
    next();
  };
}

module.exports = { verifyTokenMiddleware, requireRole };
