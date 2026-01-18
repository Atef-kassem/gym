const express = require("express");
const supplierSettingsController = require("../controllers/supplierSettingsController");
const authController = require("../controllers/authController");
const router = express.Router();

// Protect all routes
// router.use(authController.protect);

// Dropdown Definitions Routes
router.route("/dropdown-definitions")
  .get(supplierSettingsController.getAllDropdownDefinitions)
  .post(supplierSettingsController.createDropdownDefinition);

router.route("/dropdown-definitions/:id")
  .get(supplierSettingsController.getDropdownDefinition)
  .patch(supplierSettingsController.updateDropdownDefinition)
  .delete(supplierSettingsController.deleteDropdownDefinition);

router.route("/dropdown-definitions/:id/toggle-status")
  .patch(supplierSettingsController.toggleDefinitionStatus);

router.route("/dropdown-definitions/:id/add-value")
  .post(supplierSettingsController.addValueToDefinition);

router.route("/dropdown-definitions/:id/remove-value/:valueIndex")
  .delete(supplierSettingsController.removeValueFromDefinition);

router.route("/dropdown-definitions/category/:category")
  .get(supplierSettingsController.getActiveDropdownDefinitions);

// Supplier Categories Routes
router.route("/supplier-categories")
  .get(supplierSettingsController.getAllSupplierCategories)
  .post(supplierSettingsController.createSupplierCategory);

router.route("/supplier-categories/:id")
  .get(supplierSettingsController.getSupplierCategory)
  .patch(supplierSettingsController.updateSupplierCategory)
  .delete(supplierSettingsController.deleteSupplierCategory);

router.route("/supplier-categories/:id/toggle-status")
  .patch(supplierSettingsController.toggleCategoryStatus);

router.route("/supplier-categories/active")
  .get(supplierSettingsController.getActiveSupplierCategories);

// Supply Regions Routes
router.route("/supply-regions")
  .get(supplierSettingsController.getAllSupplyRegions)
  .post(supplierSettingsController.createSupplyRegion);

router.route("/supply-regions/:id")
  .get(supplierSettingsController.getSupplyRegion)
  .patch(supplierSettingsController.updateSupplyRegion)
  .delete(supplierSettingsController.deleteSupplyRegion);

router.route("/supply-regions/:id/toggle-status")
  .patch(supplierSettingsController.toggleRegionStatus);

router.route("/supply-regions/:id/add-branch")
  .post(supplierSettingsController.addBranchToRegion);

router.route("/supply-regions/:id/remove-branch/:branchIndex")
  .delete(supplierSettingsController.removeBranchFromRegion);

router.route("/supply-regions/active")
  .get(supplierSettingsController.getActiveSupplyRegions);

router.route("/supply-regions/country/:country")
  .get(supplierSettingsController.getRegionsByCountry);

// Payment Terms Routes
router.route("/payment-terms")
  .get(supplierSettingsController.getAllPaymentTerms)
  .post(supplierSettingsController.createPaymentTerm);

router.route("/payment-terms/:id")
  .get(supplierSettingsController.getPaymentTerm)
  .patch(supplierSettingsController.updatePaymentTerm)
  .delete(supplierSettingsController.deletePaymentTerm);

router.route("/payment-terms/:id/toggle-status")
  .patch(supplierSettingsController.toggleTermStatus);

router.route("/payment-terms/active")
  .get(supplierSettingsController.getActivePaymentTerms);

router.route("/payment-terms/type/:type")
  .get(supplierSettingsController.getTermsByType);

// Statistics Routes
router.route("/statistics")
  .get(supplierSettingsController.getSettingsStatistics);

module.exports = router;
