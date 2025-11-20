// src/services/employees.service.js
import { API_URL } from "../config/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJsonResponse(res) {
  // intenta parsear JSON; si no es JSON, lanza un error genérico
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }
  if (!res.ok) {
    // json puede tener { error: "..." } o similar
    throw new Error(json.error || json.message || "Error en la petición");
  }
  return json;
}

/* =========================
   AUTH (login / verify / logout)
   ========================= */

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/api/employees/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const json = await handleJsonResponse(res);
  // json esperado: { token, user: { ... } }
  return json;
};

export const verifyToken = async (token) => {
  // Si te pasan token explícito, úsalo; si no, usa localStorage
  const authHeader = token
    ? { Authorization: `Bearer ${token}` }
    : getAuthHeaders();

  const res = await fetch(`${API_URL}/api/employees/me`, {
    method: "GET",
    headers: { ...authHeader },
  });

  const json = await handleJsonResponse(res);
  // json esperado: { user: { ... } }
  return json;
};

export const logoutUser = async () => {
  const res = await fetch(`${API_URL}/api/employees/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    // intenta leer json si hay mensaje
    try {
      const json = await res.json();
      throw new Error(json.error || "Error al cerrar sesión");
    } catch {
      throw new Error("Error al cerrar sesión");
    }
  }
  return true;
};

/* =========================
   CRUD USUARIOS (usa Bearer token)
   ========================= */

export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/api/employees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const json = await handleJsonResponse(res);
  // json esperado: array de usuarios
  return json;
};

export const getUserById = async (id) => {
  const res = await fetch(`${API_URL}/api/employees/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const json = await handleJsonResponse(res);
  return json;
};

export const createUser = async (userData) => {
  const res = await fetch(`${API_URL}/api/employees/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });

  const json = await handleJsonResponse(res);
  return json;
};

export const updateUser = async (id, userData) => {
  const res = await fetch(`${API_URL}/api/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });

  const json = await handleJsonResponse(res);
  return json;
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/api/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const json = await handleJsonResponse(res);
  return json;
};
