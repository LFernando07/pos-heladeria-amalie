const { getAllFlavoursModel, createFlavourModel } = require("./flavours.model");

const getAllFlavoursService = (callback) => {
  getAllFlavoursModel((err, flavours) => {
    if (err) return callback(err);
    callback(null, flavours);
  });
};

const createFlavourService = (data, callback) => {
  createFlavourModel(data, callback);
};

module.exports = {
  getAllFlavoursService,
  createFlavourService,
};
