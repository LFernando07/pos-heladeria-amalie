const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../modules/employees/employees.service");

// Middleware para verificar token desde cookie o header Authorization
function verifyTokenMiddleware(req, res, next) {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ success: false, error: "No autorizado" });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err)
      return res.status(401).json({ success: false, error: "Token inválido" });
    req.user = payload;
    next();
  });
}

// Middleware para roles: requireRole('admin')
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, error: "No autorizado" });
    if (req.user.rol !== role)
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    next();
  };
}

module.exports = { verifyTokenMiddleware, requireRole };
