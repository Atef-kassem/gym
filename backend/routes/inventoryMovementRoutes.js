const express = require('express');
const router = express.Router();
const inventoryMovementController = require('../controllers/inventoryMovementController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const protectionMiddleware = require('../middlewares/protectionMiddleware');

// تطبيق middleware المصادقة على جميع المسارات
router.use(isLoggedIn);
router.use(protectionMiddleware);

// مسارات حركات المخزون الأساسية
router.post('/movements', inventoryMovementController.createMovement);
router.get('/movements', inventoryMovementController.getMovements);
router.get('/movements/:id', inventoryMovementController.getMovementById);
router.put('/movements/:id', inventoryMovementController.updateMovement);
router.delete('/movements/:id', inventoryMovementController.deleteMovement);

// مسارات الإحصائيات والتحليلات
router.get('/statistics', inventoryMovementController.getStatistics);
router.get('/export', inventoryMovementController.exportMovements);

// مسارات الذكاء الاصطناعي والرؤى
router.get('/ai-insights', inventoryMovementController.getAIInsights);
router.get('/smart-alerts', inventoryMovementController.getSmartAlerts);
router.put('/smart-alerts/:id/status', inventoryMovementController.updateAlertStatus);

module.exports = router;
