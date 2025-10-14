const express = require("express");
const { getAllCategories, createCategory } = require("./categories.controller");

const routerCategories = express.Router();

routerCategories.get("/", getAllCategories);
routerCategories.post("/", createCategory);

module.exports = routerCategories;
