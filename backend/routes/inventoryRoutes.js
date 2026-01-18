const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/inventoryController");

router.post("/", InventoryController.create);
router.get("/:inventoryId", InventoryController.getById);
router.get("/product/:productId/warehouse/:warehouseId", InventoryController.getByProductAndWarehouse);
router.get("/", InventoryController.getAll);
router.put("/stock/product/:productId/warehouse/:warehouseId", InventoryController.updateStock);
router.put("/set-stock/product/:productId/warehouse/:warehouseId", InventoryController.setStock);
router.put("/settings/product/:productId/warehouse/:warehouseId", InventoryController.updateSettings);
router.get("/low-stock", InventoryController.getLowStockAlerts);
router.get("/stock-levels/:warehouseId", InventoryController.getStockLevelsByWarehouse);
router.delete("/:inventoryId", InventoryController.delete);

module.exports = router;
