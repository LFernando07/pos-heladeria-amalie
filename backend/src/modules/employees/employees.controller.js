const {
  getAllUsersService,
  getUserByIdService,
  registerUserService,
  loginService,
  updateUserService,
  changePasswordService,
  deleteUserService,
  JWT_SECRET,
} = require("./employees.service");

// GET /api/empleados
function getAllUsers(req, res) {
  getAllUsersService((err, users) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: users });
  });
}

// GET /api/empleados/:id
function getUserById(req, res) {
  const { id } = req.params;
  getUserByIdService(id, (err, user) => {
    if (err)
      return res.status(400).json({ success: false, error: err.message });
    res.json({ success: true, data: user });
  });
}

// GET /api/empleados/me
function getMe(req, res) {
  // req.user proviene del middleware verifyToken
  if (!req.user)
    return res.status(401).json({ success: false, error: "No autenticado" });
  res.json({ success: true, data: req.user });
}

// POST /api/empleados/register
function register(req, res) {
  const { nombre, usuario, password } = req.body;
  if (!nombre || !usuario || !password)
    return res
      .status(400)
      .json({ success: false, error: "Campos obligatorios" });

  registerUserService(req.body, (err, user) => {
    if (err) {
      if (err.message && err.message.includes("UNIQUE")) {
        return res
          .status(400)
          .json({ success: false, error: "Usuario o email ya registrado" });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ success: true, data: user });
  });
}

// POST /api/empleados/login
function login(req, res) {
  const { usuario, password } = req.body;
  if (!usuario || !password)
    return res
      .status(400)
      .json({ success: false, error: "Credenciales requeridas" });

  loginService(usuario, password, (err, result) => {
    if (err)
      return res.status(401).json({ success: false, error: err.message });

    const { token, user } = result;

    // Set cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: user });
  });
}

// POST /api/empleados/logout
function logout(req, res) {
  res.clearCookie("token");
  res.json({ success: true });
}

// PUT /api/empleados/:id
function updateUser(req, res) {
  const { id } = req.params;
  const data = req.body;
  updateUserService(id, data, (err, user) => {
    if (err)
      return res.status(400).json({ success: false, error: err.message });
    res.json({ success: true, data: user });
  });
}

// PUT /api/empleados/:id/password
function changePassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword)
    return res
      .status(400)
      .json({ success: false, error: "Password requerido" });

  changePasswordService(id, newPassword, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
}

// DELETE /api/empleados/:id
function deleteUser(req, res) {
  const { id } = req.params;
  deleteUserService(id, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  getMe,
  register,
  login,
  logout,
  updateUser,
  changePassword,
  deleteUser,
};
