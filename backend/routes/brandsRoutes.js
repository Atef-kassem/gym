const Router = require("express").Router();
const brandsController = require("../controllers/brandsController");

// Brands routes
Router.route("/").get(brandsController.getAllBrands).post(brandsController.createBrand);

Router.route("/:id")
  .get(brandsController.getBrand)
  .patch(brandsController.updateBrand)
  .delete(brandsController.deleteBrand);

module.exports = Router;
