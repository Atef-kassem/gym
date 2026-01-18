const express = require("express");
const router = express.Router();

const compositeProductController = require("../controllers/compositeProductController");

// 🟢 Create new composite product
router.post("/", compositeProductController.createCompositeProduct);

// 🔵 Get all composite products
router.get("/", compositeProductController.getAllCompositeProducts);

// 🔵 Get single composite product by ID
router.get("/:id", compositeProductController.getCompositeProductById);

// 🟡 Update composite product by ID
router.put("/:id", compositeProductController.updateCompositeProduct);

// 🔴 Delete composite product by ID
router.delete("/:id", compositeProductController.deleteCompositeProduct);

module.exports = router;
