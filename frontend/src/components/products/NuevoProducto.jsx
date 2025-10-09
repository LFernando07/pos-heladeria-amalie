import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './NuevoProducto.css';

const categorias = ['Comida', 'Postres', 'Botanas', 'Soda Italiana', 'Frappés', 'Malteadas', 'Helados'];

const NuevoProducto = () => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagen, setImagen] = useState(null); // 1. Nuevo estado para el archivo
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !precio || !categoria || !imagen) {
            setError('Por favor, completa todos los campos y añade una imagen.');
            return;
        }

        /*const nuevoProducto = {
            nombre,
            precio: parseFloat(precio), 
            categoria,
        };*/

        // 2. Usamos FormData para poder enviar archivos y texto juntos
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('precio', parseFloat(precio));
        formData.append('categoria', categoria);
        if (imagen) {
            formData.append('imagen', imagen); // El nombre 'imagen' debe coincidir con el del backend
        }

        try {
            const response = await fetch('http://localhost:3001/api/productos', {
                method: 'POST',
                /*headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoProducto),*/

                // 3. ¡IMPORTANTE! No se especifica 'Content-Type'. El navegador lo hará automáticamente por nosotros.
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ocurrió un error al guardar el producto.');
            }

            alert('¡Producto guardado con éxito!');
            navigate('/'); // para redirigir a la página principal

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
                        <option value="" disabled>Selecciona una categoría (!)</option>
                        {categorias.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
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
                    <button type="submit" className="btn-submit">Guardar Producto</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NuevoProducto;