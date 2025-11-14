const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const { getSalesReportService } = require("./reports.service");

function getSalesReport(req, res) {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Se requieren fecha de inicio y fecha de fin.",
    });
  }

  getSalesReportService(startDate, endDate, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data });
  });
}

async function sendReportEmail(req, res) {
  const { to, subject, body } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER || "jpgjake03@gmail.com",
        pass: process.env.MAIL_PASSWORD || "nkig byee kfss xrdi",
      },
    });

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se recibió el archivo adjunto" });
    }

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html: body,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer, // ✅ correcto con memoryStorage
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Correo enviado exitosamente ✅" });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ error: error.toString() });
  }
}

module.exports = {
  getSalesReport,
  sendReportEmail,
};
