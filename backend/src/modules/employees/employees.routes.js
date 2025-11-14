// src/modules/employees/employees.routes.js
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
  const router = express.Router();

  // Rutas públicas
  router.post("/login", login);
  router.post("/logout", logout);

  // Rutas protegidas
  router.get("/me", verifyTokenMiddleware, getMe);
  router.post(
    "/register",
    verifyTokenMiddleware,
    requireRole("admin"),
    register
  );
  router.get("/", verifyTokenMiddleware, requireRole("admin"), getAllUsers);
  router.get("/:id", verifyTokenMiddleware, requireRole("admin"), getUserById);
  router.put("/:id", verifyTokenMiddleware, updateUser);
  router.put("/:id/password", verifyTokenMiddleware, changePassword);
  router.delete(
    "/:id",
    verifyTokenMiddleware,
    requireRole("admin"),
    deleteUser
  );

  return router;
};
