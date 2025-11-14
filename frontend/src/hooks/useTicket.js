import { useState, useEffect, useCallback, useMemo } from "react";
import { useDateTime } from "./useDateTime";
import { usePayment } from "./usePayment";
import { createSale } from "../services/sales.service";
import { generatePdf } from "../services/pdf.service";
import { useAuth } from "../context/AuthContext";

export const useTicket = (items, onClear) => {
  const [total, setTotal] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const { formattedDate, formattedTime } = useDateTime();
  const { montoRecibido, cambio, handleKeyPress, resetPayment } =
    usePayment(total);
  const { user } = useAuth();

  // ✅ Calcular el total solo cuando cambian los items
  useEffect(() => {
    setTotal(
      items.reduce((acc, product) => acc + product.precio * product.cantidad, 0)
    );
  }, [items]);

  // ✅ Limpiar pago si el carrito se vacía
  useEffect(() => {
    if (items.length === 0) resetPayment();
  }, [items, resetPayment]);

  // ✅ Memoizamos validaciones para evitar recreaciones
  const isCartEmpty = useMemo(() => items.length === 0, [items]);
  const isPaymentValid = useMemo(
    () => parseFloat(montoRecibido) >= total,
    [montoRecibido, total]
  );

  // ✅ Procesar el pago con callback optimizado
  const handleProcessPayment = useCallback(async () => {
    if (isCartEmpty) {
      alert("No hay productos en la orden.");
      return;
    }

    if (!isPaymentValid) {
      alert("El monto recibido es insuficiente.");
      return;
    }

    setLoading(true);

    try {
      const recibido = parseFloat(montoRecibido) || 0;

      // Guardar venta en el servidor
      const result = await createSale({
        total,
        fecha: formattedDate,
        hora: formattedTime,
        empleado_id: parseInt(user.id),
        pagado: recibido,
        cambio,
        productos: items,
      });

      const digitsDate = formattedDate.replace(/\//g, "");

      // Generar PDF con el folio real
      await generatePdf({
        id: digitsDate + result.ventaId,
        folioVenta: result.folio,
        items,
        total,
        formattedDate,
        formattedTime,
        montoRecibido: recibido,
        cambio,
        nombreEmpleado: user.nombre,
      });

      // Mostrar toast de éxito
      setShowSuccessToast(true);

      // 🔄 Limpiar y reiniciar después de 2 segundos
      setTimeout(() => {
        setShowSuccessToast(false);
        onClear();
        resetPayment();
      }, 2000);
    } catch (error) {
      console.error("Error al procesar venta:", error);
      alert(error.message || "Error al procesar la venta.");
    } finally {
      setLoading(false);
    }
  }, [
    isCartEmpty,
    isPaymentValid,
    montoRecibido,
    total,
    formattedDate,
    formattedTime,
    user,
    cambio,
    items,
    onClear,
    resetPayment,
  ]);

  // ✅ Cancelar transacción de forma limpia
  const handleCancel = useCallback(() => {
    onClear();
    resetPayment();
  }, [onClear, resetPayment]);

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
