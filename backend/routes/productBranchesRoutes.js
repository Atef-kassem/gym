const express = require("express");
const productBranchesController = require("../controllers/productBranchesController");
const authController = require("../controllers/authController");

const router = express.Router();

// Routes for product branches
router
  .route("/")
  .get(productBranchesController.getAllProductBranches)
  .post(productBranchesController.createProductBranch);

router
  .route("/:productId/:branchId")
  .get(productBranchesController.getProductBranch)
  .patch(productBranchesController.updateProductBranch)
  .delete(productBranchesController.deleteProductBranch);

// Stock management routes
router.route("/:productId/:branchId/stock").patch(productBranchesController.updateStock);

// Branch-specific routes
router.route("/branch/:branchId/products").get(productBranchesController.getProductsByBranch);

router.route("/branch/:branchId/low-stock").get(productBranchesController.getLowStockItems);

// Product-specific routes
router.route("/product/:productId/branches").get(productBranchesController.getBranchesByProduct);

module.exports = router;
