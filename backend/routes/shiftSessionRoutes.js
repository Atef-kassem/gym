const express = require("express");
const router = express.Router();
const controller = require("../controllers/shiftSessionController");

/**
 * Routes لإدارة جلسات الورديات
 * Base URL: /api/v1/shift-sessions
 */

// POST /api/v1/shift-sessions/start - بدء جلسة وردية جديدة
router.post("/start", controller.startShiftSession);

// GET /api/v1/shift-sessions/current - جلب الجلسة الحالية المفتوحة
router.get("/current", controller.getCurrentSession);

// GET /api/v1/shift-sessions/daily-report - جلب تقرير يومي لجميع الورديات
router.get("/daily-report", controller.getDailyReport);

// GET /api/v1/shift-sessions/:id - جلب جلسة محددة
router.get("/:id", controller.getSessionById);

// GET /api/v1/shift-sessions - جلب جميع الجلسات مع فلترة
router.get("/", controller.getAllSessions);

// PUT /api/v1/shift-sessions/:id/close - إغلاق جلسة وردية
router.put("/:id/close", controller.closeShiftSession);

// PUT /api/v1/shift-sessions/:id/auto-close - إغلاق تلقائي للجلسة (معطل بناءً على طلب المستخدم)
// router.put("/:id/auto-close", controller.autoCloseSession);

module.exports = router;

