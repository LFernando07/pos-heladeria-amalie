/*ESTE ES EL COMPONENTE PRINCIPAL DE LA SECCIÓN REPORTES
ESTÁ LA INTERFAZ Y LÓGICA DE EXPORTACIÓN */


import React, { useState } from 'react';
import { getSalesReport, sendReportByEmail } from '../../services/reports.service';
import jsPDF from 'jspdf';
//import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import logo from '../../../images/logo_amelie.png';
import { FaFilePdf, FaFileExcel, FaClipboardList } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import './ReportsManagement.css';

const ReportsManagement = () => {
    const currentUser = { name: 'Jake Ponciano' };

    // Estados para las fechas, los datos del reporte y la carga
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            alert('Por favor, selecciona un rango de fechas.');
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

    const exportToPDF = () => {
        const img = new Image();
        img.src = logo;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/png');

            const doc = new jsPDF();

            const pageWidth = doc.internal.pageSize.getWidth();
            const imgWidth = 25;
            const imgHeight = 25;
            const imgX = (pageWidth - imgWidth) / 2;
            doc.addImage(imgData, 'PNG', imgX, 5, imgWidth, imgHeight);

            doc.setFont('helvetica');
            doc.setFontSize(12);
            doc.text('Helados Amelie.', 10, 30);
            doc.text(`Reporte solicitado por: ${currentUser.name}.`, 10, 35);
            doc.text(`Reporte de Ventas desde la fecha: (${startDate} a: ${endDate}).`, 10, 40);

            autoTable(doc, {
                head: [['Folio', 'Fecha', 'Hora', 'Total', 'Empleado']],
                body: reportData.map(sale => [
                    sale.id,
                    sale.fecha,
                    sale.hora,
                    `$${sale.total.toFixed(2)}`,
                    sale.empleado,
                ]),
                startY: 50,
            });
            doc.save(`reporte_ventas_${startDate}_a_${endDate}.pdf`);
        };
    };


    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(reportData.map(sale => ({
            Folio: sale.id,
            Fecha: sale.fecha,
            Hora: sale.hora,
            Total: sale.total,
            Pagado: sale.pagado,
            Cambio: sale.cambio,
            Empleado: sale.empleado,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
        XLSX.writeFile(workbook, `reporte_ventas_${startDate}_a_${endDate}.xlsx`);
    };

    // AÑADE LA NUEVA FUNCIÓN PARA ENVIAR EL CORREO
    const handleEmailReport = async () => {
        const recipientEmail = prompt("Por favor, introduce el correo del destinatario:");
        if (!recipientEmail) {
            return; // El usuario canceló o no escribió nada
        }
        // A. Genera el PDF en memoria, sin descargarlo
        const doc = new jsPDF();
        doc.text(`Reporte de Ventas (${startDate} a ${endDate})`, 14, 16);
        autoTable(doc, {
            head: [['Folio', 'Fecha', 'Hora', 'Total', 'Empleado']],
            body: reportData.map(sale => [
                sale.id, sale.fecha, sale.hora, `$${sale.total.toFixed(2)}`, sale.empleado
            ]),
            startY: 20,
        });
        const pdfBlob = doc.output('blob'); // Obtenemos el PDF como un 'Blob'

        // B. Prepara los datos para enviar
        const formData = new FormData();
        formData.append('to', recipientEmail);
        formData.append('subject', `Reporte de Ventas Heladería Amelie (${startDate} a ${endDate})`);
        formData.append('body', '<h1>Reporte de Ventas</h1><p>Adjunto encontrarás el reporte de ventas solicitado.</p>');
        // El nombre 'report' debe coincidir con el del backend: upload.single('report')
        formData.append('report', pdfBlob, `reporte_ventas_${startDate}_a_${endDate}.pdf`);

        try {
            // C. Llama al servicio para enviar el correo
            const result = await sendReportByEmail(formData);
            alert('Correo enviado con éxito!');
            console.log(result);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="management-container">
            <div className="page-header">
                <h1>Reporte de Ventas</h1>
            </div>

            <div className="report-controls">
                <div className="date-picker">
                    <label htmlFor="start-date">Fecha de Inicio:</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="date-picker">
                    <label htmlFor="end-date">Fecha de Fin:</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <button className="btn-generate" onClick={handleGenerateReport} disabled={loading}>
                    {loading ? 'Generando...' : 'Generar Reporte'}
                    <FaClipboardList />
                </button>
            </div>

            {reportData.length > 0 && (
                <div className="export-buttons">
                    <button onClick={exportToPDF} className='btnpdf'>Exportar a PDF <FaFilePdf /></button>
                    <button onClick={exportToExcel} className='btnexcel'>Exportar a Excel <FaFileExcel /></button>
                    <button onClick={handleEmailReport} className="btn-email">Enviar por Correo <AiOutlineMail /></button>
                </div>
            )}

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
                    {reportData.map(sale => (
                        <tr key={sale.id}>
                            <td>#{sale.id}</td>
                            <td>{sale.fecha}</td>
                            <td>{sale.hora}</td>
                            <td>${(sale.total || 0).toFixed(2)}</td>
                            <td>{sale.empleado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsManagement;