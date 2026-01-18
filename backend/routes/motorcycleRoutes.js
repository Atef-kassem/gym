const express = require("express");
const router = express.Router();
const motorcycleController = require("../controllers/motorcycleController");
const protectionMiddleware = require("../middlewares/protectionMiddleware");

// تطبيق middleware المصادقة على جميع المسارات
router.use(protectionMiddleware);

// مسارات الدراجات النارية
router.route("/")
  .get(motorcycleController.getAllMotorcycles)
  .post(motorcycleController.createMotorcycle);

router.route("/next-code")
  .get(motorcycleController.getNextMotorcycleCode);

router.route("/stats")
  .get(motorcycleController.getMotorcycleStats);

router.route("/search")
  .get(motorcycleController.searchMotorcycles);

router.route("/:id")
  .get(motorcycleController.getMotorcycle)
  .put(motorcycleController.updateMotorcycle)
  .delete(motorcycleController.deleteMotorcycle);

router.route("/:id/status")
  .put(motorcycleController.updateMotorcycleStatus);

module.exports = router;
