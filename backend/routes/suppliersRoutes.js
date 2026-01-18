const Router = require("express").Router();
const suppliersController = require("../controllers/suppliersController");

// Suppliers routes
Router.route("/").get(suppliersController.getAllSuppliers).post(suppliersController.createSupplier);

Router.route("/:id")
  .get(suppliersController.getSupplier)
  .patch(suppliersController.updateSupplier)
  .delete(suppliersController.deleteSupplier);

module.exports = Router;
