const express = require("express");
const router = express.Router();
const deliveryDriverController = require("../controllers/deliveryDriverController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// تطبيق middleware المصادقة على جميع المسارات
router.use(isLoggedIn);

// مسارات سائقي التوصيل
router.route("/")
  .get(deliveryDriverController.getAllDeliveryDrivers)
  .post(deliveryDriverController.createDeliveryDriver);

router.route("/stats")
  .get(deliveryDriverController.getDriverStats);

router.route("/available")
  .get(deliveryDriverController.getAvailableDrivers);

router.route("/search")
  .get(deliveryDriverController.searchDeliveryDrivers);

router.route("/:id")
  .get(deliveryDriverController.getDeliveryDriver)
  .put(deliveryDriverController.updateDeliveryDriver)
  .delete(deliveryDriverController.deleteDeliveryDriver);

router.route("/:id/status")
  .put(deliveryDriverController.updateDriverStatus);

router.route("/:id/location")
  .put(deliveryDriverController.updateDriverLocation);

module.exports = router;
