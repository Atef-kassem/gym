const express = require('express');
const router = express.Router();
const supplierReportsController = require('../controllers/supplierReportsController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

// تطبيق middleware المصادقة على جميع الطرق
router.use(isLoggedIn);

// جلب تقارير الموردين
router.get('/', supplierReportsController.getSupplierReports);

// جلب إحصائيات تقارير الموردين
router.get('/stats', supplierReportsController.getSupplierReportStats);

// جلب تقرير الأداء
router.get('/performance', supplierReportsController.getSupplierPerformanceReport);

// جلب تقرير المدفوعات
router.get('/payments', supplierReportsController.getSupplierPaymentsReport);

// جلب تقرير الطلبيات
router.get('/orders', supplierReportsController.getSupplierOrdersReport);

// جلب تقرير الشكاوى والمرتجعات
router.get('/complaints', supplierReportsController.getSupplierComplaintsReport);

// جلب تقرير المخاطر
router.get('/risks', supplierReportsController.getSupplierRisksReport);

// تصدير تقرير
router.post('/export', supplierReportsController.exportSupplierReport);

module.exports = router;
