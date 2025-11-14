import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getSalesReport,
  sendReportByEmail,
} from "../../services/reports.service";
import {
  FaFilePdf,
  FaFileExcel,
  FaClipboardList,
  FaRegEnvelopeOpen,
} from "react-icons/fa";
import { Modal } from "../shared/Modal";
import { SuccessToast } from "../shared/SuccessToast";
import * as XLSX from "xlsx";
import logo from "../../assets/logo_amelie.png";
import "./ReportsManagement.css";

const ReportsManagement = () => {
  const { user } = useAuth();

  // Estados para las fechas, los datos del reporte y la carga
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para enviar correos sin usar 'prompt'
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const openEmailModal = useCallback(() => {
    setShowEmailModal(true);
  }, []);

  const closeEmailModal = useCallback(() => {
    setShowEmailModal(false);
  }, []);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert("Por favor, selecciona un rango de fechas.");
      return;
    }
    setLoading(true);
    try {
      const data = await getSalesReport(startDate, endDate);
      setReportData(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIÓN REUTILIZABLE PARA GENERAR PDF =====
  const generatePDF = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const { autoTable } = await import("jspdf-autotable");

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = logo;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL("image/png");

          const doc = new jsPDF();
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          // ===== ENCABEZADO CON DISEÑO MEJORADO =====
          doc.setFillColor(220, 20, 60); // #DC143C
          doc.rect(0, 0, pageWidth, 45, "F");

          // Logo centrado
          const imgWidth = 22;
          const imgHeight = 22;
          const imgX = (pageWidth - imgWidth) / 2;
          doc.addImage(imgData, "PNG", imgX, 8, imgWidth, imgHeight);

          // Título principal
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(18);
          doc.text("Informe de Ventas", pageWidth / 2, 37, { align: "center" });

          // ===== INFORMACIÓN DEL REPORTE =====
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);

          // Cuadro de información
          doc.setFillColor(240, 248, 255);
          doc.roundedRect(10, 50, pageWidth - 20, 25, 2, 2, "F");

          doc.setFont("helvetica", "bold");
          doc.text("Solicitado por:", 15, 58);
          doc.setFont("helvetica", "normal");
          doc.text(user.nombre, 70, 58);

          doc.setFont("helvetica", "bold");
          doc.text("Período:", 15, 65);
          doc.setFont("helvetica", "normal");
          doc.text(`${startDate} al ${endDate}`, 70, 65);

          doc.setFont("helvetica", "bold");
          doc.text("Fecha de generación:", 15, 72);
          doc.setFont("helvetica", "normal");
          doc.text(new Date().toLocaleDateString("es-MX"), 70, 72);

          // ===== RESUMEN DE VENTAS =====
          const totalVentas = reportData.reduce(
            (sum, sale) => sum + sale.total,
            0
          );
          const numVentas = reportData.length;
          const promedioVenta = totalVentas / numVentas || 0;

          doc.setFillColor(220, 20, 60); // #DC143C
          doc.rect(10, 80, pageWidth - 20, 8, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text("RESUMEN EJECUTIVO", pageWidth / 2, 85.5, {
            align: "center",
          });

          // Tarjetas de resumen
          const cardWidth = (pageWidth - 35) / 3;
          const cardY = 92;
          const cardHeight = 18;

          // Card 1: Total de ventas
          doc.setFillColor(240, 248, 255);
          doc.roundedRect(10, cardY, cardWidth, cardHeight, 2, 2, "F");
          doc.setTextColor(0, 150, 200);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Total Ventas", 10 + cardWidth / 2, cardY + 6, {
            align: "center",
          });
          doc.setFontSize(14);
          doc.text(
            `$${totalVentas.toFixed(2)}`,
            10 + cardWidth / 2,
            cardY + 14,
            {
              align: "center",
            }
          );

          // Card 2: Número de ventas
          doc.setFillColor(240, 248, 255);
          doc.roundedRect(
            15 + cardWidth,
            cardY,
            cardWidth,
            cardHeight,
            2,
            2,
            "F"
          );
          doc.setFontSize(10);
          doc.text(
            "Núm. de Ventas",
            15 + cardWidth + cardWidth / 2,
            cardY + 6,
            {
              align: "center",
            }
          );
          doc.setFontSize(14);
          doc.text(`${numVentas}`, 15 + cardWidth + cardWidth / 2, cardY + 14, {
            align: "center",
          });

          // Card 3: Promedio por venta
          doc.setFillColor(240, 248, 255);
          doc.roundedRect(
            20 + cardWidth * 2,
            cardY,
            cardWidth,
            cardHeight,
            2,
            2,
            "F"
          );
          doc.setFontSize(10);
          doc.text(
            "Promedio/Venta",
            20 + cardWidth * 2 + cardWidth / 2,
            cardY + 6,
            { align: "center" }
          );
          doc.setFontSize(14);
          doc.text(
            `$${promedioVenta.toFixed(2)}`,
            20 + cardWidth * 2 + cardWidth / 2,
            cardY + 14,
            { align: "center" }
          );

          // ===== TABLA DE VENTAS =====
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Detalle de Ventas", 10, 120);

          autoTable(doc, {
            head: [["Folio", "Fecha", "Hora", "Total", "Empleado"]],
            body: reportData.map((sale) => [
              sale.id,
              sale.fecha,
              sale.hora,
              `$${sale.total.toFixed(2)}`,
              sale.empleado_nombre,
            ]),
            startY: 125,
            theme: "striped",
            headStyles: {
              fillColor: [220, 20, 60], // #DC143C
              textColor: [255, 255, 255],
              fontStyle: "bold",
              halign: "center",
              fontSize: 10,
            },
            bodyStyles: {
              fontSize: 9,
              textColor: [60, 60, 60],
            },
            alternateRowStyles: {
              fillColor: [240, 248, 255],
            },
            columnStyles: {
              0: { halign: "center", cellWidth: 20 },
              1: { halign: "center", cellWidth: 30 },
              2: { halign: "center", cellWidth: 25 },
              3: { halign: "center", cellWidth: 30 },
              4: { halign: "center" },
            },
            margin: { left: 10, right: 10 },
            didDrawPage: () => {
              // Footer en cada página
              const pageCount = doc.internal.getNumberOfPages();
              const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

              doc.setFontSize(8);
              doc.setTextColor(128, 128, 128);
              doc.text(
                `Helados Amelie - Página ${currentPage} de ${pageCount}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: "center" }
              );
            },
          });

          // ===== PIE DE PÁGINA FINAL =====
          const finalY = doc.lastAutoTable.finalY || 125;

          if (finalY < pageHeight - 40) {
            doc.setDrawColor(220, 20, 60); // #DC143C
            doc.setLineWidth(0.5);
            doc.line(10, finalY + 10, pageWidth - 10, finalY + 10);

            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "italic");
            doc.text(
              "Este documento es un reporte generado automáticamente por el sistema de Helados Amelie",
              pageWidth / 2,
              finalY + 16,
              { align: "center" }
            );
          }

          // Retornar el documento PDF
          resolve(doc);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Error al cargar el logo"));
      };
    });
  }, [startDate, endDate, reportData, user.nombre]);

  // ===== EXPORTAR PDF (DESCARGAR) =====
  const exportToPDF = useCallback(async () => {
    try {
      const doc = await generatePDF();
      doc.save(`reporte_ventas_${startDate}_a_${endDate}.pdf`);
    } catch (error) {
      alert("Error al generar el PDF: " + error.message);
    }
  }, [startDate, endDate, generatePDF]);

  // ===== EXPORTAR A EXCEL =====
  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.map((sale) => ({
        Folio: sale.id,
        Fecha: sale.fecha,
        Hora: sale.hora,
        Total: sale.total,
        Pagado: sale.pagado,
        Cambio: sale.cambio,
        Empleado: sale.empleado_nombre,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
    XLSX.writeFile(workbook, `reporte_ventas_${startDate}_a_${endDate}.xlsx`);
  }, [startDate, endDate, reportData]);

  // ===== ENVIAR POR CORREO =====
  const handleEmailReport = useCallback(async () => {
    if (!email.trim()) {
      alert("Introduce una direccion de correo electronica valida");
      return;
    }

    try {
      // Generar el PDF usando la función reutilizable
      const doc = await generatePDF();
      const pdfBlob = doc.output("blob");

      // Preparar los datos para enviar
      const formData = new FormData();
      formData.append("to", email);
      formData.append(
        "subject",
        `Reporte de Ventas Heladería Amelie (${startDate} a ${endDate})`
      );
      formData.append(
        "body",
        "<h1>Reporte de Ventas</h1><p>Adjunto encontrarás el reporte de ventas solicitado.</p>"
      );
      formData.append(
        "report",
        pdfBlob,
        `reporte_ventas_${startDate}_a_${endDate}.pdf`
      );

      // Llamar al servicio para enviar el correo
      await sendReportByEmail(formData);
      setShowSuccessToast(true);

      setTimeout(() => {
        closeEmailModal();
      }, 1000);
    } catch (error) {
      alert("Error al enviar el correo: " + error.message);
    }
  }, [startDate, endDate, closeEmailModal, generatePDF, email]);

  const renderReportTable = useMemo(() => {
    if (reportData.length === 0) return null;

    return (
      <table className="management-table">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Total</th>
            <th>Empleado</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((sale) => (
            <tr key={sale.id}>
              <td>#{sale.id}</td>
              <td>{sale.fecha}</td>
              <td>{sale.hora}</td>
              <td>${(sale.total || 0).toFixed(2)}</td>
              <td>{sale.empleado_nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [reportData]);

  const exportButtons = useMemo(
    () => (
      <div className="export-buttons">
        <button onClick={exportToPDF} className="btnpdf">
          <span>Exportar a PDF</span> <FaFilePdf />
        </button>
        <button onClick={exportToExcel} className="btnexcel">
          <span>Exportar a Excel</span> <FaFileExcel />
        </button>
        <button onClick={openEmailModal} className="btn-email">
          <span>Enviar por Correo</span>{" "}
          <FaRegEnvelopeOpen className="icon-email" />
        </button>
      </div>
    ),
    [exportToPDF, exportToExcel, openEmailModal]
  );

  return (
    <div className="management-container">
      <div className="page-header">
        <h1 className="title-report">Reporte de Ventas</h1>
      </div>

      <div className="report-controls">
        <div className="date-picker">
          <label htmlFor="start-date">Fecha de Inicio:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-picker">
          <label htmlFor="end-date">Fecha de Fin:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="btn-generate"
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar Reporte"} <FaClipboardList />
        </button>
      </div>

      {reportData.length > 0 && exportButtons}
      {renderReportTable}

      {showEmailModal && (
        <Modal onClose={closeEmailModal}>
          <div className="product-modal-content">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2>Enviar Reporte por Email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="product-modal-input"
              placeholder="example@gmail.com"
              autoFocus
            />
          </div>
          <div className="report-modal-buttons">
            <button onClick={closeEmailModal} className="btn-cancel">
              Cancelar
            </button>
            <button onClick={handleEmailReport} className="btn-confirm">
              Enviar
            </button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <SuccessToast mensaje={"¡Correo enviado exitosamente!"} />
      )}
    </div>
  );
};

export default ReportsManagement;
