const express = require("express");
const supplierDashboardController = require("../controllers/supplierDashboardController");
const router = express.Router();

// Dashboard Routes - لا تحتاج مصادقة مؤقتاً للاختبار
// router.use(authController.protect);

// إحصائيات الموردين
router.route("/stats")
  .get(supplierDashboardController.getSupplierStats);

// أفضل الموردين
router.route("/top")
  .get(supplierDashboardController.getTopSuppliers);

// نشاط الموردين
router.route("/activity")
  .get(supplierDashboardController.getSupplierActivity);

// مؤشرات الأداء
router.route("/performance")
  .get(supplierDashboardController.getSupplierPerformance);

// التنبيهات
router.route("/alerts")
  .get(supplierDashboardController.getSupplierAlerts);

// العقود النشطة
router.route("/contracts")
  .get(supplierDashboardController.getActiveContracts);

// المدفوعات
router.route("/payments")
  .get(supplierDashboardController.getSupplierPayments);

// تصدير البيانات
router.route("/export")
  .post(supplierDashboardController.exportSuppliers);

module.exports = router;
