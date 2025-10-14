import { BrowserRouter, Routes, Route } from "react-router";
import { WrapperProducts } from "./components/products/WrapperProducts";
import { NuevoProducto } from "./components/products/NuevoProducto";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WrapperProducts />} />
        <Route path="/NuevoProducto" element={<NuevoProducto />} />
      </Routes>
    </BrowserRouter>
  );
}
