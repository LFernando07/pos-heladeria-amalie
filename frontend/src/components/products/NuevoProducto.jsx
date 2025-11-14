import { useCallback, useMemo, useState, memo } from "react";
import { useNavigate } from "react-router";
import { SuccessToast } from "../shared/SuccessToast";
import { useProducts } from "../../context/ProductsContext";
import { useCategories } from "../../context/CategoryContext";
import logo from "../../assets/logo_amelie.png";
import "./NuevoProducto.css";

export const NuevoProducto = memo(() => {
  const { newProduct } = useProducts();
  const { categories } = useCategories();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState(-1);
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();

  const handleNombre = useCallback((e) => setNombre(e.target.value), []);
  const handlePrecio = useCallback((e) => setPrecio(e.target.value), []);
  const handleCategoria = useCallback((e) => setCategoria(e.target.value), []);
  const handleImagen = useCallback((e) => setImagen(e.target.files[0]), []);
  const handleCancelar = useCallback(() => navigate("/dashboard"), [navigate]);

  const categoriasOptions = useMemo(
    () =>
      categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.nombre}
        </option>
      )),
    [categories]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (!nombre || !precio || categoria === -1 || !imagen) {
        setError("Por favor, completa todos los campos y añade una imagen.");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("precio", parseFloat(precio));
      formData.append("categoria_id", parseInt(categoria));
      formData.append("imagen", imagen);

      try {
        await newProduct(formData);
        setShowSuccessToast(true);
        setTimeout(() => {
          navigate("/dashboard/products");
        }, 2000);
      } catch (err) {
        console.error("Error creando producto:", err);
        setError(err?.response?.data?.message || "Error al crear el producto.");
      }
    },
    [categoria, imagen, navigate, newProduct, nombre, precio]
  );

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit}
        className="product-form"
        encType="multipart/form-data"
      >
        <img src={logo} className="Logo Amelie" width={96} height={96} />
        <h2>Dar de Alta un Nuevo Producto</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={handleNombre}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            step="1.00"
            value={precio}
            onChange={handlePrecio}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <select id="categoria" value={categoria} onChange={handleCategoria}>
            <option value={-1}>Selecciona una categoría</option>
            {categoriasOptions}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imagen">Imagen del Producto:</label>
          <input
            type="file"
            id="imagen"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleImagen}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Guardar Producto
          </button>
          <button type="button" className="btn-cancel" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </form>

      {showSuccessToast && (
        <SuccessToast mensaje={"¡Producto guardado con éxito!"} />
      )}
    </div>
  );
});
