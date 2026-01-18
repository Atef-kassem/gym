const express = require("express");
const router = express.Router();
const sparePartController = require("../controllers/SparePartController");

// Create a new spare part
router.post("/", sparePartController.createSparePart);

// Get all spare parts with pagination and filtering
router.get("/", sparePartController.getAllSpareParts);

// Get a single spare part by ID
router.get("/:id", sparePartController.getSparePartById);

// Get spare part by code
router.get("/code/:code", sparePartController.getSparePartByCode);

// Update a spare part
router.put("/:id", sparePartController.updateSparePart);

// Delete a spare part
router.delete("/:id", sparePartController.deleteSparePart);

// Get low stock items
router.get("/stock/low", sparePartController.getLowStockItems);

// Update stock quantity
router.patch("/:id/stock", sparePartController.updateStock);

module.exports = router;
