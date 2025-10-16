/* ESTE COMPONENTE ES EL QUE CONTIENE TODA LA GESTIÓN DEL DASHBOARD */

import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { deleteProduct } from '../../services/products.service';
import { FaTrashAlt, FaEdit} from 'react-icons/fa';
import { MdOutlineCreate } from 'react-icons/md';
import './ProductManagement.css'; 

const ProductManagement = () => {
  const { products, loading, error, refreshProducts } = useProducts();

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await deleteProduct(id);
        alert('Producto eliminado con éxito');
        refreshProducts(); // se refresca la lista de productos
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar los productos: {error}</p>;

  return (
    <div className="management-container">
      <div className="page-header">
        <h1>Catálogo de Productos</h1>
        {/* Este Link debe coincidir con la ruta definida en App.jsx */}
        <Link to="/dashboard/products/new" className="btn-add">
          <MdOutlineCreate size={25} /> Agregar Producto
        </Link>
      </div>
      

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <img 
                  src={product.imagen ? product.imagen : '/images/placeholder.png'} 
                  alt={product.nombre} 
                  className="product-table-img"
                />
              </td>
              <td>{product.nombre}</td>
              <td>${product.precio.toFixed(2)}</td>
              <td>{product.categoria}</td>
              <td className="actions-cell">
                <button className="btn-edit"><FaEdit />Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(product.id)}><FaTrashAlt />Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;