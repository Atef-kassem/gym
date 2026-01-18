const Router = require("express").Router();
const warehouseController = require("../controllers/warehouseController");

// Warehouse routes
Router.route("/").get(warehouseController.getAllWarehouses).post(warehouseController.createWarehouse);

Router.route("/:id")
  .get(warehouseController.getWarehouse)
  .patch(warehouseController.updateWarehouse)
  .delete(warehouseController.deleteWarehouse);

Router.route("/:id/inventory").get(warehouseController.getWarehouseInventory);

Router.route("/:id/inventory/:inventoryId").patch(warehouseController.updateWarehouseInventory);

module.exports = Router;
