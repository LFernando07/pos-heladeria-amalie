import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../services/products.service";

console.log("render hook");
export const useProducts = () => {
  const [productosBase, setProductosBase] = useState([]);
  const [categoria, setCategoria] = useState("Todos los productos");

  // Efecto de carga de productos
  useEffect(() => {
    //aqui se hace la peticion al servidor para obtener los productos al iniciar la app
    fetchProducts()
      .then((result) => setProductosBase(result.data))
      .catch((error) => {
        console.error("Error al cargar el catálogo:", error);
        alert(
          "No se pudo cargar el catálogo de productos. Revisar si el servidor está corriendo."
        );
      });
  }, []); //solo se realiza una vez

  //Funcion para realizar el filtrado de productos
  const productos = useMemo(() => {
    console.log("render categoria");
    return categoria === "Todos los productos"
      ? productosBase
      : productosBase.filter((p) => p.categoria === categoria);
  }, [categoria, productosBase]);

  return {
    productosBase,
    setProductosBase,
    categoria,
    setCategoria,
    productos,
  };
};
