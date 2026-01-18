const express = require("express");
const router = express.Router();
const controller = require("../controllers/quickPurchaseOrderController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// تطبيق middleware المصادقة على جميع المسارات
router.use(isLoggedIn);

// الإحصائيات
router.get("/statistics", controller.statistics);

// المسارات الأساسية
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// تغيير الحالة
router.patch("/:id/status", controller.changeStatus);

module.exports = router;

