const express = require('express');
const router = express.Router();
const posPaymentController = require('../controllers/posPaymentController');
const protectionMiddleware = require('../middlewares/protectionMiddleware');
const restrictTo = require('../middlewares/restrictionMiddleware');

// تطبيق middleware حماية المسارات على جميع المسارات
router.use(protectionMiddleware);

// مسارات طرق الدفع
router.route('/')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posPaymentController.getAllPaymentMethods)
  .post(restrictTo('Admin', 'Manager'), posPaymentController.createPaymentMethod);

router.route('/:id')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posPaymentController.getPaymentMethod)
  .patch(restrictTo('Admin', 'Manager'), posPaymentController.updatePaymentMethod)
  .delete(restrictTo('Admin'), posPaymentController.deletePaymentMethod);

router.route('/:id/toggle')
  .patch(restrictTo('Admin', 'Manager'), posPaymentController.togglePaymentMethod);

router.route('/:id/test-connection')
  .post(restrictTo('Admin', 'Manager'), posPaymentController.testPaymentConnection);

router.route('/update-order')
  .patch(restrictTo('Admin', 'Manager'), posPaymentController.updatePaymentMethodsOrder);

router.route('/stats')
  .get(restrictTo('Admin', 'Manager'), posPaymentController.getPaymentMethodsStats);

module.exports = router;
