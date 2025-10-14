const {
  getAllCategoryFlavoursModel,
  getFlavoursByCategoryModel,
  checkCategoryFlavourExistsModel,
  createCategoryFlavourModel,
  deleteCategoryFlavourModel,
} = require("./categories_flavours.model");

const getAllCategoryFlavoursService = (callback) => {
  getAllCategoryFlavoursModel((err, relations) => {
    if (err) return callback(err);
    callback(null, relations);
  });
};

const getFlavoursByCategoryService = (categoryId, callback) => {
  getFlavoursByCategoryModel(categoryId, (err, flavours) => {
    if (err) return callback(err);
    callback(null, flavours);
  });
};

const createCategoryFlavourService = (data, callback) => {
  const { categoria_id, sabor_id } = data;

  // Verificar si la relación ya existe
  checkCategoryFlavourExistsModel(categoria_id, sabor_id, (err, exists) => {
    if (err) return callback(err);

    if (exists) {
      return callback(new Error("Esta relación ya existe"));
    }

    // Crear la relación
    createCategoryFlavourModel(data, callback);
  });
};

const deleteCategoryFlavourService = (id, callback) => {
  deleteCategoryFlavourModel(id, callback);
};

module.exports = {
  getAllCategoryFlavoursService,
  getFlavoursByCategoryService,
  createCategoryFlavourService,
  deleteCategoryFlavourService,
};
