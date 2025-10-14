const {
  getAllCategoriesModel,
  createCategoryModel,
} = require("./categories.model");

const getAllCategoriesService = (callback) => {
  getAllCategoriesModel((err, categories) => {
    if (err) return callback(err);
    callback(null, categories);
  });
};

const createCategoryService = (data, callback) => {
  createCategoryModel(data, callback);
};

module.exports = {
  getAllCategoriesService,
  createCategoryService,
};
