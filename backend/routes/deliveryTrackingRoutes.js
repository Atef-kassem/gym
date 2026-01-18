const express = require("express");
const router = express.Router();
const deliveryTrackingController = require("../controllers/deliveryTrackingController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// تطبيق middleware المصادقة على جميع المسارات
router.use(isLoggedIn);

// مسارات تتبع التوصيل
router.route("/")
  .get(deliveryTrackingController.getAllTrackingRecords)
  .post(deliveryTrackingController.createTrackingRecord);

router.route("/stats")
  .get(deliveryTrackingController.getTrackingStats);

router.route("/search")
  .get(deliveryTrackingController.searchTrackingRecords);

router.route("/delivery/:deliveryOrderId")
  .get(deliveryTrackingController.getDeliveryTrackingPath);

router.route("/motorcycle/:motorcycleId/current")
  .get(deliveryTrackingController.getCurrentMotorcycleLocation);

router.route("/driver/:driverId/current")
  .get(deliveryTrackingController.getCurrentDriverLocation);

router.route("/:id")
  .get(deliveryTrackingController.getTrackingRecord)
  .put(deliveryTrackingController.updateTrackingRecord)
  .delete(deliveryTrackingController.deleteTrackingRecord);

module.exports = router;
