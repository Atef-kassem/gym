const express = require('express');
const router = express.Router();
const posNotificationController = require('../controllers/posNotificationController');
const protectionMiddleware = require('../middlewares/protectionMiddleware');
const restrictTo = require('../middlewares/restrictionMiddleware');

// تطبيق middleware حماية المسارات على جميع المسارات
router.use(protectionMiddleware);

// مسارات قواعد الإشعارات
router.route('/')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posNotificationController.getAllNotificationRules)
  .post(restrictTo('Admin', 'Manager'), posNotificationController.createNotificationRule);

router.route('/:id')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posNotificationController.getNotificationRule)
  .patch(restrictTo('Admin', 'Manager'), posNotificationController.updateNotificationRule)
  .delete(restrictTo('Admin'), posNotificationController.deleteNotificationRule);

router.route('/:id/toggle')
  .patch(restrictTo('Admin', 'Manager'), posNotificationController.toggleNotificationRule);

router.route('/:id/test')
  .post(restrictTo('Admin', 'Manager'), posNotificationController.testNotificationRule);

router.route('/send-immediate')
  .post(restrictTo('Admin', 'Manager'), posNotificationController.sendImmediateNotification);

router.route('/update-order')
  .patch(restrictTo('Admin', 'Manager'), posNotificationController.updateRulesOrder);

router.route('/stats')
  .get(restrictTo('Admin', 'Manager'), posNotificationController.getNotificationRulesStats);

module.exports = router;
