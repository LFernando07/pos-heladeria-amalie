const {
  getAllCategoriesModel,
  getCategoryByIdModel,
  createCategoryModel,
  updateCategoryModel,
  deleteCategoryModel,
} = require("./categories.model");

const getAllCategoriesService = (callback) => {
  getAllCategoriesModel((err, categories) => {
    if (err) return callback(err);
    callback(null, categories);
  });
};

const getCategoryByIdService = (id, callback) => {
  getCategoryByIdModel(id, (err, category) => {
    if (err) return callback(err);
    callback(null, category);
  });
};

const createCategoryService = (data, callback) => {
  createCategoryModel(data, callback);
};

const updateCategoryService = (id, data, callback) => {
  // Validar que el nombre no esté vacío
  if (!data.nombre || data.nombre.trim() === "") {
    return callback(new Error("El nombre de la categoría es obligatorio"));
  }

  updateCategoryModel(id, data, callback);
};

const deleteCategoryService = (id, callback) => {
  deleteCategoryModel(id, callback);
};

module.exports = {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
