import { useState, useEffect } from "react";
import { useDateTime } from "./useDateTime";
import { usePayment } from "./usePayment";
import { createSale } from "../services/sales.service";
import { generatePdf } from "../services/pdf.service";

export const useTicket = (items, onClear) => {
  const [total, setTotal] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const { formattedDate, formattedTime } = useDateTime();
  const { montoRecibido, cambio, handleKeyPress, resetPayment } =
    usePayment(total);

  // Calcular total a pagar cuando cambian los "n" items
  useEffect(() => {
    const newTotal = items.reduce(
      (acc, product) => acc + product.precio * product.cantidad,
      0
    );
    setTotal(newTotal);
  }, [items]);

  const handleProcessPayment = async () => {
    const recibido = parseFloat(montoRecibido) || 0;

    // Validaciones si la orden esta vacia
    if (items.length === 0) {
      alert("No hay productos en la orden.");
      return;
    }
    // Validacion si el dinero dado "escrito" es menor al pagar
    if (recibido < total) {
      alert("El monto recibido es insuficiente.");
      return;
    }

    setLoading(true);

    try {
      // Guardar venta en el servidor
      const result = await createSale({
        total,
        fecha: formattedDate,
        hora: formattedTime,
        empleado_id: 2 /*"Jake Ponciano"*/, // TODO: Obtener del contexto de usuario
        pagado: recibido,
        cambio,
        productos: items,
      });

      const digitsDate = formattedDate.replace(/\//g, "");

      // Generar PDF con el folio real
      generatePdf({
        id: digitsDate + result.ventaId,
        folioVenta: result.folio,
        items,
        total,
        formattedDate,
        formattedTime,
        montoRecibido: recibido,
        cambio,
        nombreEmpleado: "Jake Ponciano", // TODO: Cambiar por el nombre del contexto
      });

      // Mostrar toast de éxito
      setShowSuccessToast(true);

      // Limpiar después de 2 segundos
      setTimeout(() => {
        setShowSuccessToast(false);
        onClear();
        resetPayment();
      }, 2000);
    } catch (error) {
      console.error("Error al procesar venta:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClear();
    resetPayment();
  };

  return {
    total,
    montoRecibido,
    cambio,
    formattedDate,
    formattedTime,
    showKeypad,
    setShowKeypad,
    showSuccessToast,
    loading,
    handleKeyPress,
    handleProcessPayment,
    handleCancel,
  };
};
