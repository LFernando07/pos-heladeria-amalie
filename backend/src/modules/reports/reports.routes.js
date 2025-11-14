const express = require("express");
const multer = require("multer");
const { getSalesReport, sendReportEmail } = require("./reports.controller");

const routerReports = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

routerReports.get("/sales", getSalesReport);
routerReports.post("/email", upload.single("report"), sendReportEmail);

module.exports = routerReports;
