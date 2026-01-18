const express = require("express");
const router = express.Router();
const mainCategoryController = require("../controllers/mainCategoryController");

// Create a new main category
router.post("/", mainCategoryController.createMainCategory);

// Get all main categories
router.get("/", mainCategoryController.getAllMainCategories);

// Get a single main category by ID
router.get("/:id", mainCategoryController.getMainCategory);

// Update a main category
router.put("/:id", mainCategoryController.updateMainCategory);

// Delete a main category
router.delete("/:id", mainCategoryController.deleteMainCategory);

// Get main categories with pagination
router.get("/paginated/list", mainCategoryController.getMainCategoriesPaginated);

module.exports = router;
