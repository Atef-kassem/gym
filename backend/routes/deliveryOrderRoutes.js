const express = require("express");
const router = express.Router();
const deliveryOrderController = require("../controllers/deliveryOrderController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// تطبيق middleware المصادقة على جميع المسارات
router.use(isLoggedIn);

// مسارات طلبات التوصيل
router.route("/")
  .get(deliveryOrderController.getAllDeliveryOrders)
  .post(deliveryOrderController.createDeliveryOrder);

router.route("/stats")
  .get(deliveryOrderController.getDeliveryOrderStats);

router.route("/search")
  .get(deliveryOrderController.searchDeliveryOrders);

router.route("/:id")
  .get(deliveryOrderController.getDeliveryOrder)
  .put(deliveryOrderController.updateDeliveryOrder)
  .delete(deliveryOrderController.deleteDeliveryOrder);

router.route("/:id/status")
  .put(deliveryOrderController.updateDeliveryOrderStatus);

router.route("/:id/cancel")
  .put(deliveryOrderController.cancelDeliveryOrder);

module.exports = router;
