const express = require("express");
const router = express.Router();
const consumablesController = require("../controllers/consumablesController"); // Adjust path based on your project structure
const { dynamicUpload } = require("../middlewares/fileUpload");

const consumablesFileFields = ["attachmentImage"];
// CRUD Routes
router.post("/", dynamicUpload(consumablesFileFields), consumablesController.createConsumable);
router.get("/", consumablesController.getAllConsumables);
router.get("/:id", consumablesController.getConsumableById);
router.patch("/:id", dynamicUpload(consumablesFileFields), consumablesController.updateConsumable);
router.delete("/:id", consumablesController.deleteConsumable);

// Set consumable stock quantity (for stock taking)
router.put("/:id/set-stock", consumablesController.setConsumableStock);

module.exports = router;
