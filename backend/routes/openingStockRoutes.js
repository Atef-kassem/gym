const express = require("express");
const router = express.Router();
const openingStockController = require("../controllers/openingStockController");

// Create a new opening stock
router.post("/", openingStockController.createOpeningStock);

// Get opening stocks with pagination
router.get("/paginated/list", openingStockController.getOpeningStocksPaginated);

// Get all opening stocks
router.get("/", openingStockController.getAllOpeningStocks);

// Get opening stocks by branch
router.get("/branch/:branchId", openingStockController.getOpeningStocksByBranch);

// Get opening stocks by warehouse
router.get("/warehouse/:warehouseId", openingStockController.getOpeningStocksByWarehouse);

// Get a single opening stock by ID
router.get("/:id", openingStockController.getOpeningStock);

// Update an opening stock
router.put("/:id", openingStockController.updateOpeningStock);

// Delete an opening stock
router.delete("/:id", openingStockController.deleteOpeningStock);

module.exports = router;
