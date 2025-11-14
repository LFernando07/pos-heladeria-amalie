import jsPDF from "jspdf";
import { generateBarCode } from "../utils/barcodeGenerator";

export const generatePdf = ({
  id,
  folioVenta,
  items,
  total,
  formattedDate,
  formattedTime,
  montoRecibido,
  cambio,
  nombreEmpleado,
}) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [80, 180],
  });

  // Header
  doc.setFont("Courier", "bold");
  doc.setFontSize(12);
  doc.text("Helados Amelie", doc.internal.pageSize.getWidth() / 2, 10, {
    align: "center",
  });

  doc.setFont("Courier", "normal");
  doc.setFontSize(10);
  doc.text("Sucursal #001", doc.internal.pageSize.getWidth() / 2, 15, {
    align: "center",
  });
  doc.text("Av. Miacatlan SN", doc.internal.pageSize.getWidth() / 2, 20, {
    align: "center",
  });
  doc.text(
    "------------------------",
    doc.internal.pageSize.getWidth() / 2,
    25,
    {
      align: "center",
    }
  );

  // Datos de la venta
  doc.setFontSize(9);
  doc.text(`Venta: ${folioVenta}`, 5, 30);
  doc.text(`Fecha: ${formattedDate} ${formattedTime}`, 5, 35);
  doc.text(`Atendido por: ${nombreEmpleado}`, 5, 40);
  doc.text(
    "------------------------",
    doc.internal.pageSize.getWidth() / 2,
    45,
    {
      align: "center",
    }
  );

  // Items
  let y = 50;
  items.forEach((item) => {
    const subtotal = (item.cantidad * item.precio).toFixed(2);
    const itemText = `${item.cantidad}x ${item.nombre}`;
    const splitText = doc.splitTextToSize(itemText, 55);

    doc.text(splitText, 5, y);
    doc.text(`$${subtotal}`, 75, y, { align: "right" });
    y += splitText.length * 4 + 2;
  });

  // Total
  doc.text(
    "------------------------",
    doc.internal.pageSize.getWidth() / 2,
    y,
    {
      align: "center",
    }
  );
  y += 5;

  doc.setFont("Courier", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", 5, y);
  doc.text(`$${total.toFixed(2)}`, 75, y, { align: "right" });
  y += 7;

  // Pago
  doc.setFont("Courier", "normal");
  doc.setFontSize(10);
  doc.text("Monto Recibido:", 5, y);
  doc.text(`$${montoRecibido.toFixed(2)}`, 75, y, { align: "right" });
  y += 5;
  doc.text("Cambio:", 5, y);
  doc.text(`$${cambio.toFixed(2)}`, 75, y, { align: "right" });
  y += 7;

  doc.text(
    "------------------------",
    doc.internal.pageSize.getWidth() / 2,
    y,
    {
      align: "center",
    }
  );
  y += 7;

  // Código de barras
  doc.setFontSize(11);
  doc.addImage(generateBarCode(id), "PNG", 15, y, 50, 20);
  y += 25;

  // Footer
  doc.text("¡Gracias por su compra!", doc.internal.pageSize.getWidth() / 2, y, {
    align: "center",
  });
  y += 5;
  doc.text("¡Vuelva pronto!", doc.internal.pageSize.getWidth() / 2, y, {
    align: "center",
  });

  doc.save(`${folioVenta}.pdf`);
};
