
import { BrowserRouter, Routes, Route} from 'react-router'
import WrapperProducts from "./WrapperProducts";
import NuevoProducto from "./NuevoProducto";
 
export default function App() {
  return (<BrowserRouter>
    <Routes>
      <Route path="/" element={<WrapperProducts />} />
      <Route path="/NuevoProducto" element={<NuevoProducto />} />
    </Routes>
  
  </BrowserRouter>
  );
}