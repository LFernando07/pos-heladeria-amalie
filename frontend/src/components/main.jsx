import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Importa tu componente principal App
import './App.css';     // Importa tus estilos globales

// Esta línea busca el div con id="root" y monta tu componente App dentro de él
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);