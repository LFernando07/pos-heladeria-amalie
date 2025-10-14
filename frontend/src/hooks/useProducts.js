import { useEffect, useMemo, useState } from "react";
import { createProduct, fetchProducts } from "../services/products.service";

export const useProducts = () => {
  const [productosBase, setProductosBase] = useState([]);
  const [categoria, setCategoria] = useState("Todos los productos");

  // Efecto de carga de productos
  useEffect(() => {
    //aqui se hace la peticion al servidor para obtener los productos al iniciar la app
    fetchProducts()
      .then((result) => setProductosBase(result.data))
      .catch((error) => {
        console.error("Error al cargar el catálogo de productos:", error);
        alert(
          "No se pudo cargar el catálogo de productos. Revisar si el servidor está corriendo."
        );
      });
  }, []); //solo se realiza una vez

  //Funcion para realizar el filtrado de productos
  const productos = useMemo(() => {
    return categoria === "Todos los productos"
      ? productosBase
      : productosBase.filter((p) => p.categoria === categoria);
  }, [categoria, productosBase]);

  // Funcion para crear un nuevo producto
  const newProduct = async (data) => {
    await createProduct(data);
  };

  return {
    productosBase,
    setProductosBase,
    categoria,
    setCategoria,
    productos,
    newProduct,
  };
};
