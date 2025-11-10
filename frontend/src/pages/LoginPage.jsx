import React, { useState, useCallback, useMemo } from "react";
import "./LoginPage.css";
import { useAuth } from "../context/AuthContext";
import logo from "../../images/logo_amelie.png";

export const LoginPage = () => {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Función memoizada para manejar el submit
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (!usuario || !password) {
        setError("Por favor, ingresa tu usuario y contraseña.");
        return;
      }

      try {
        await login(usuario, password);
      } catch (err) {
        setError(err.message);
      }
    },
    [usuario, password, login]
  );

  // ✅ Memo para el mensaje de error (evita re-renderizar el form)
  const errorMessage = useMemo(
    () => error && <p className="login-error-message">{error}</p>,
    [error]
  );

  return (
    <div className="login-page-background">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-container-card">
        <div className="login-header">
          <div className="header-shape shape-1"></div>
          <div className="header-shape shape-2"></div>
          <div className="header-shape shape-3"></div>

          <div className="header-content">
            <div className="header-logo">
              <img
                src={logo}
                alt="Logo Heladería Amelie"
                className="logo-image"
              />
            </div>
            <h1>¡Bienvenido!</h1>
            <p>Inicia sesión para acceder al sistema.</p>
          </div>
        </div>

        <div className="login-form-area">
          <h2>INICIO DE SESIÓN</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-icon-wrapper">
                <span>👤</span>
              </div>
              <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            <div className="input-group">
              <div className="input-icon-wrapper">
                <span>🔒</span>
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMessage}

            <button type="submit" className="login-button">
              ENTRAR
            </button>
          </form>
          <p className="form-footer">Sistema de Punto de Venta Amelie</p>
        </div>
      </div>
    </div>
  );
};
