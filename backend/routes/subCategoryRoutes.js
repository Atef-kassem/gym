const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

// Create a new sub category
router.post("/", subCategoryController.createSubCategory);

// Get sub categories with pagination
router.get("/paginated/list", subCategoryController.getSubCategoriesPaginated);

// Get all sub categories
router.get("/", subCategoryController.getAllSubCategories);

// Get sub categories by main category
router.get("/main-category/:mainCategoryId", subCategoryController.getSubCategoriesByMainCategory);

// Get a single sub category by ID
router.get("/:id", subCategoryController.getSubCategory);

// Update a sub category
router.put("/:id", subCategoryController.updateSubCategory);

// Delete a sub category
router.delete("/:id", subCategoryController.deleteSubCategory);

module.exports = router;
