import React, { useState, useEffect } from 'react';
import './Ticket.css';
import { FaTrash, FaCashRegister } from 'react-icons/fa';
import jsPDF from 'jspdf'; // Se importa la librería que acabas de instalar
import JsBarCode from 'jsbarcode'; // Librería para generar códigos de barras

// --- Componente para la Animación de Éxito ---
const SuccessToast = () => {
  return (
    <div className="success-toast">
      <div className="success-icon">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
      </div>
      <p>Venta Registrada</p>
    </div>
  );
};

// --- Componente del Teclado Numérico ---
const NumericKeypad = ({ onKeyPress, onClose }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
  return (
    <div className="keypad-backdrop" onClick={onClose}>
      <div className="keypad" onClick={(e) => e.stopPropagation()}>
        <div className="keypad-header">
          <span>Ingresar Monto</span>
          <button className="keypad-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="keypad-grid">
          {keys.map((key) => (<button key={key} onClick={() => onKeyPress(key)}>{key}</button>))}
          <button className="keypad-clear-btn" onClick={() => onKeyPress('C')}>C</button>
        </div>
      </div>
    </div>
  );
};

const Ticket = ({ items, onClear, onIncrement, onDecrement }) => {
  const [total, setTotal] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [montoRecibido, setMontoRecibido] = useState('');
  const [cambio, setCambio] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);
  // Estado para controlar la visibilidad de la animación de éxito
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  //const idVenta = '000012345';
  const nombreEmpleado = 'Jake Ponciano';

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newTotal = items.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
    setTotal(newTotal);
  }, [items]);

  useEffect(() => {
    const recibido = parseFloat(montoRecibido) || 0;
    setCambio(recibido >= total ? recibido - total : 0);
  }, [montoRecibido, total]);

  const handleKeyPress = (key) => {
    if (key === 'C') setMontoRecibido('');
    else if (key === '⌫') setMontoRecibido((prev) => prev.slice(0, -1));
    else if (key === '.' && montoRecibido.includes('.')) return;
    else setMontoRecibido((prev) => prev + key);
  };
  
  const canva = document.createElement('canvas');
  canva.id = "barcode";

  const generateBarCode= (idVenta) => {

    // Generar el diseño del codigo de barra
    JsBarCode(canva, idVenta, {
      format: 'CODE128',
      width: 2,
      height: 50,
      displayValue: true
    })

    const imgData = canva.toDataURL("image/png");

    return imgData;
  }

  
  // --- Función que crea el PDF ---
  const generatePdf = (folioVenta) => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [80, 297] // Ancho de ticket estándar
    });
    
    // Configuración de la fuente (tipo "máquina de escribir")
    doc.setFont("Courier", "bold");
    doc.setFontSize(12);
    doc.text("Helados Amelie", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });
    
    doc.setFont("Courier", "normal");
    doc.setFontSize(10);
    doc.text("Sucursal #001", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
    doc.text("Av. Miacatlan SN", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    doc.text("------------------------", doc.internal.pageSize.getWidth() / 2, 25, { align: "center" });
    
    doc.setFontSize(9);
    doc.text(`Venta: #${folioVenta}`, 5, 30);
    doc.text(`Fecha: ${formattedDate} ${formattedTime}`, 5, 35);
    doc.text(`Atendido por: ${nombreEmpleado}`, 5, 40);
    doc.text("------------------------", doc.internal.pageSize.getWidth() / 2, 45, { align: "center" });

    let y = 50;
    items.forEach(item => {
      const subtotal = (item.cantidad * item.precio).toFixed(2);
      const itemText = `${item.cantidad}x ${item.nombre}`;
      
      // --- CAMBIO PRINCIPAL: Lógica de ajuste de texto ---
      // Divide el texto del producto en líneas si es demasiado largo
      const splitText = doc.splitTextToSize(itemText, 55); // 55mm de ancho máximo
      
      // Dibuja el texto (que puede tener varias líneas)
      doc.text(splitText, 5, y);
      
      // Dibuja el subtotal alineado con la primera línea del texto del producto
      doc.text(`$${subtotal}`, 75, y, { align: "right" });
      
      // Incrementa la posición 'y' basado en cuántas líneas ocupó el texto
      y += (splitText.length * 4) + 2; // 4mm por línea + 2mm de espacio
    });

    doc.text("------------------------", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 5;
    
    doc.setFont("Courier", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", 5, y);
    doc.text(`$${total.toFixed(2)}`, 75, y, { align: "right" });
    y += 7;

    doc.setFont("Courier", "normal");
    doc.setFontSize(10);
    doc.text("Monto Recibido:", 5, y);
    doc.text(`$${parseFloat(montoRecibido).toFixed(2)}`, 75, y, { align: "right" });
    y += 5;
    doc.text("Cambio:", 5, y);
    doc.text(`$${cambio.toFixed(2)}`, 75, y, { align: "right" });
    y += 7;

    doc.text("------------------------", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 7;
    
    doc.setFontSize(11);

    doc.addImage(generateBarCode(folioVenta), 'PNG', 15, y, 50, 20);
    y += 25;

    doc.text("¡Gracias por su compra!", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 5;
    doc.text("Vuelva pronto :D", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });

    // Guarda y descarga el archivo PDF
    doc.save(`venta-${folioVenta}.pdf`);
  };


  const handleProcessPayment = async () => {
    const recibido = parseFloat(montoRecibido) || 0;
    if (items.length === 0) { alert('No hay productos en la orden.'); return; }
    if (recibido < total) { alert('El monto recibido es insuficiente.'); return; }

    //lo que se enviará al servidor
    const ventaData = {
      total: total,
      date: formattedDate,
      time: formattedTime,
      employee: nombreEmpleado,
      pagado: recibido, // Añadimos el monto recibido (convertido a número)
      cambio: cambio,   // Añadimos el cambio calculado
      products: items 
    };

    try{
      // Hacemos la petición POST al servidor para guardar la venta
      const response = await fetch('http://localhost:3001/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData),
      });

      if (!response.ok) {
        // Si el servidor da un error, lo mostramos y detenemos el proceso
        throw new Error('Error al guardar la venta en la base de datos.');
      }

      // 4. Si la venta se guardó con éxito, continuamos con el resto del proceso
      const result = await response.json();
      console.log('Venta guardada con éxito:', result);

      // Obtenemos el folio real de la respuesta del servidor
      const folioReal = result.ventaId;

      // Pasamos ese folio a la función que genera el PDF
      generatePdf(folioReal);
      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
        onClear();
        setMontoRecibido('');
      }, 2000);
    } catch (error) {
      console.error("Falló la operación de venta:", error);
      alert(error.message);
    }
  };

  const formattedDate = currentDateTime.toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const formattedTime = currentDateTime.toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  return (
    <>
      <div className="ticket-container">
        <div className="ticket">
          {/* El resto del JSX del ticket no cambia... */}
          <div className="ticket-header">
            <h1>RESUMEN DE LA VENTA</h1>
            <p>Atendido por: {nombreEmpleado}</p>
            <p>Fecha: {formattedDate} - Hora: {formattedTime}</p>
          </div>
          <div className="items">
            <div className="items-header">
              <span className="product-col">PRODUCTO</span>
              <span className="quantity-col">CANTIDAD</span>
              <span className="subtotal-col">SUBTOTAL</span>
            </div>
            {items.length === 0 ? (
              <p className="empty-ticket-message">No hay productos en la orden</p>
            ) : (
              items.map((product) => (
                <div className="item" key={product.id}>
                  <span className="product-col">{product.nombre}</span>
                  <div className="quantity-col quantity-control">
                    <button onClick={() => onDecrement(product.id)}>-</button>
                    <span>{product.cantidad}</span>
                    <button onClick={() => onIncrement(product.id)}>+</button>
                  </div>
                  <span className="subtotal-col">${(product.precio * product.cantidad).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
          <div className="payment-details">
            <div className="total">
              <h2>Total a pagar:</h2>
              <h2>${total.toFixed(2)}</h2>
            </div>
            <div className="amount-received">
              <label>Monto Recibido:</label>
              <input type="text" value={montoRecibido ? `$${montoRecibido}` : ''} placeholder="$0.00" readOnly onClick={() => setShowKeypad(true)} />
            </div>
            <div className="change-display">
              <h3>Cambio:</h3>
              <h3>${cambio.toFixed(2)}</h3>
            </div>
          </div>
          <div className="actions">
            <button className="cancel-btn" onClick={() => { onClear(); setMontoRecibido(''); }}>
              <FaTrash /> CANCELAR ORDEN
            </button>
            <button className="pay-btn" onClick={handleProcessPayment}>
              <FaCashRegister /> COBRAR EN EFECTIVO
            </button>
          </div>
        </div>
      </div>
      {showKeypad && <NumericKeypad onKeyPress={handleKeyPress} onClose={() => setShowKeypad(false)} />}
      {showSuccessToast && <SuccessToast />}
    </>
  );
};

export default Ticket;



