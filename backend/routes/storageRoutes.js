// routes/storageRoutes.js
const express = require("express");
const router = express.Router();
const storageController = require("../controllers/storageController");
const { dynamicUpload } = require("../middlewares/fileUpload");

const storageFileFields = [
  "storageImageAttachment",
  "licenceAttachment",
  "safetyCertificationAttachment",
  "WarehousePlansAttachment",
  "inventoryReportsAttachment",
  "anotherAttachments",
];

router.route("/").get(storageController.getAllStorages);
router.route("/:id/products").post(storageController.addProductToStorage).get(storageController.getStorageProducts);
router
  .route("/:id")
  .get(storageController.getStorageById)

  .patch(dynamicUpload(storageFileFields), storageController.updateStorage)

  .delete(storageController.deleteStorage);

module.exports = router;
