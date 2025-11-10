const express = require("express");
const {
  getAllUsers,
  getUserById,
  getMe,
  register,
  login,
  logout,
  updateUser,
  changePassword,
  deleteUser,
} = require("./employees.controller");

const {
  verifyTokenMiddleware,
  requireRole,
} = require("../../middlewares/auth.middleware");

module.exports = () => {
  const routerEmployees = express.Router();

  routerEmployees.post("/register", register); // podría protegerse en prod para admins
  routerEmployees.post("/login", login);
  routerEmployees.post("/logout", logout);

  routerEmployees.get("/me", verifyTokenMiddleware, getMe);

  // Rutas protegidas (ejemplo: solo admin puede listar/borrar)
  routerEmployees.get(
    "/",
    verifyTokenMiddleware,
    requireRole("admin"),
    getAllUsers
  );
  routerEmployees.get(
    "/:id",
    verifyTokenMiddleware,
    requireRole("admin"),
    getUserById
  );
  routerEmployees.get("/:id", verifyTokenMiddleware, getAllUsers); // o getUserById
  routerEmployees.put("/:id", verifyTokenMiddleware, updateUser);
  routerEmployees.put("/:id/password", verifyTokenMiddleware, changePassword);
  routerEmployees.delete(
    "/:id",
    verifyTokenMiddleware,
    requireRole("admin"),
    deleteUser
  );

  return routerEmployees;
};
