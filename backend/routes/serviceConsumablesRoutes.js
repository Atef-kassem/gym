const express = require("express");
const router = express.Router();
const controller = require("../controllers/serviceConsumablesController");

/**
 * Routes لإدارة ربط الخدمات بالمواد المستهلكة
 * Base URL: /api/v1/service-consumables
 */

// GET /api/v1/service-consumables - جلب جميع الروابط
router.get("/", controller.getAll);

// GET /api/v1/service-consumables/service/:serviceId - جلب المواد المستهلكة لخدمة معينة
router.get("/service/:serviceId", controller.getByService);

// POST /api/v1/service-consumables - إضافة مادة مستهلكة لخدمة
router.post("/", controller.create);

// POST /api/v1/service-consumables/batch - ربط عدة مواد بخدمة دفعة واحدة
router.post("/batch", controller.createBatch);

// PUT /api/v1/service-consumables/:id - تحديث رابط
router.put("/:id", controller.update);

// DELETE /api/v1/service-consumables/:id - حذف رابط
router.delete("/:id", controller.delete);

module.exports = router;

