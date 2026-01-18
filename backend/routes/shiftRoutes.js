const express = require("express");
const router = express.Router();
const controller = require("../controllers/shiftController");

/**
 * Routes لإدارة الورديات
 * Base URL: /api/v1/shifts
 */

// GET /api/v1/shifts/current - جلب الوردية الحالية
router.get("/current", controller.getCurrentShift);

// GET /api/v1/shifts/revenue - جلب إيرادات جميع الورديات
router.get("/revenue", controller.getAllShiftsRevenue);

// GET /api/v1/shifts/:id/revenue - جلب إيرادات وردية محددة
router.get("/:id/revenue", controller.getShiftRevenue);

// GET /api/v1/shifts/:id - جلب وردية محددة
router.get("/:id", controller.getShiftById);

// GET /api/v1/shifts - جلب جميع الورديات
router.get("/", controller.getAllShifts);

// POST /api/v1/shifts - إنشاء وردية جديدة
router.post("/", controller.createShift);

// PUT /api/v1/shifts/:id - تحديث وردية
router.put("/:id", controller.updateShift);

// DELETE /api/v1/shifts/:id - حذف وردية
router.delete("/:id", controller.deleteShift);

module.exports = router;

