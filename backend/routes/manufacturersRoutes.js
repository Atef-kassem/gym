const Router = require("express").Router();
const manufacturersController = require("../controllers/manufacturersController");

// Manufacturers routes
Router.route("/").get(manufacturersController.getAllManufacturers).post(manufacturersController.createManufacturer);

Router.route("/:id")
  .get(manufacturersController.getManufacturer)
  .patch(manufacturersController.updateManufacturer)
  .delete(manufacturersController.deleteManufacturer);

module.exports = Router;
