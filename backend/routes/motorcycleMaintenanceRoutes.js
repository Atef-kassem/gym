const express = require("express");
const router = express.Router();
const motorcycleMaintenanceController = require("../controllers/motorcycleMaintenanceController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// تطبيق middleware المصادقة على جميع المسارات
router.use(isLoggedIn);

// مسارات صيانة الدراجات النارية
router.route("/")
  .get(motorcycleMaintenanceController.getAllMaintenances)
  .post(motorcycleMaintenanceController.createMaintenance);

router.route("/stats")
  .get(motorcycleMaintenanceController.getMaintenanceStats);

router.route("/upcoming")
  .get(motorcycleMaintenanceController.getUpcomingMaintenances);

router.route("/:id")
  .get(motorcycleMaintenanceController.getMaintenance)
  .put(motorcycleMaintenanceController.updateMaintenance)
  .delete(motorcycleMaintenanceController.deleteMaintenance);

router.route("/:id/status")
  .put(motorcycleMaintenanceController.updateMaintenanceStatus);

module.exports = router;
