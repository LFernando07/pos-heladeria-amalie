const express = require("express");
const { getAllFlavours, createFlavour } = require("./flavours.controller");

const routerFlavours = express.Router();

routerFlavours.get("/", getAllFlavours);
routerFlavours.post("/", createFlavour);

module.exports = routerFlavours;
