import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./RegisterPage.css";
import logo from "../assets/logo_amelie.png";
import { Link } from "react-router";

export const RegisterPage = () => {
  const { register } = useAuth();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (
        !usuario ||
        !password ||
        !email ||
        !telefono ||
        !nombre ||
        !apellido
      ) {
        setError("Por favor, llena todos los campos.");
        return;
      }
      const userData = {
        nombre,
        apellido,
        email,
        telefono,
        rol: "despachador",
        usuario,
        password,
      };

      try {
        await register(userData);
      } catch (err) {
        setError(err.message);
      }
    },
    [nombre, apellido, email, telefono, usuario, password, register]
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
            <h1>¡REGISTRAR USUARIO!</h1>
          </div>
        </div>

        <div className="login-form-area">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-icon-wrapper">
                <span>👤</span>
              </div>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="input-group">
              <div className="input-icon-wrapper">
                <span>👤</span>
              </div>
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="input-group">
              <div className="input-icon-wrapper">
                <span>📧</span>
              </div>
              <input
                type="email"
                placeholder="Correo electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <div className="input-icon-wrapper">
                <span>📱</span>
              </div>
              <input
                type="tel"
                placeholder="Telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
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

            <div className="register-actions">
              <Link
                to={"/dashboard/users"}
                type="submit"
                className="register-to-back"
              >
                Volver
              </Link>
              <button type="submit" className="register-button">
                Agregar
              </button>
            </div>
          </form>
          <p className="form-footer">Sistema de Punto de Venta Amelie</p>
        </div>
      </div>
    </div>
  );
};
