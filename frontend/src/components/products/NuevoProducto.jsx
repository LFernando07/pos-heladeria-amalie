import { useState } from "react";
import { useNavigate } from "react-router";
import { useCategories } from "../../hooks/useCategories";
import "./NuevoProducto.css";
import { useProducts } from "../../hooks/useProducts";
import { SuccessToast } from "../shared/SuccessToast";

export const NuevoProducto = () => {
  const { newProduct } = useProducts();
  const { categorias } = useCategories();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState(0);
  const [imagen, setImagen] = useState(null); // 1. Nuevo estado para el archivo
  const [error, setError] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !precio || !categoria || !imagen) {
      setError("Por favor, completa todos los campos y añade una imagen.");
      return;
    }

    // 2. Usamos FormData para poder enviar archivos y texto juntos
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", parseFloat(precio));
    formData.append("categoria_id", categoria);
    if (imagen) {
      formData.append("imagen", imagen); // El nombre 'imagen' debe coincidir con el del backend
    }

    try {
      // Metodo para crear un nuevo producto
      await newProduct(formData);
      // Mostrar toast de éxito
      setShowSuccessToast(true);

      // alert("¡Producto guardado con éxito!");
      // Esperar a que termine la animación antes de navegar
      setTimeout(() => {
        navigate("/");
      }, 2000); // Duración de la animación del toast
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="product-form">
        <img src="./images/logo_amelie.png" className="logoP2" />
        <h2>Dar de Alta un Nuevo Producto</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            step="1.00"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="" disabled>
              Selecciona una categoría (!)
            </option>
            {categorias.map((cat) => {
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              );
            })}
          </select>
        </div>

        {/* 4. AÑADIMOS EL CAMPO PARA SUBIR LA IMAGEN */}
        <div className="form-group">
          <label htmlFor="imagen">Imagen del Producto:</label>
          <input
            type="file"
            id="imagen"
            accept="image/png, image/jpg"
            onChange={(e) => setImagen(e.target.files[0])}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Guardar Producto
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/dashboard")}
          >
            Cancelar
          </button>
        </div>
      </form>
      {showSuccessToast && (
        <SuccessToast mensaje={"¡Producto guardado con éxito!"} />
      )}
    </div>
  );
};
