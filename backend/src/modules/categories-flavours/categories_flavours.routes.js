const express = require("express");
const {
  getAllCategoryFlavours,
  getFlavoursByCategory,
  createCategoryFlavour,
  deleteCategoryFlavour,
} = require("./categories_flavours.controller");

const routerCategoryFlavours = express.Router();

routerCategoryFlavours.get("/all", getAllCategoryFlavours);
routerCategoryFlavours.get("/:id", getFlavoursByCategory);
routerCategoryFlavours.post("/", createCategoryFlavour);
routerCategoryFlavours.delete("/:id", deleteCategoryFlavour);

module.exports = routerCategoryFlavours;
