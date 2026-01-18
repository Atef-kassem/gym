const express = require('express');
const router = express.Router();
const posReportController = require('../controllers/posReportController');
const protectionMiddleware = require('../middlewares/protectionMiddleware');
const restrictTo = require('../middlewares/restrictionMiddleware');

// تطبيق middleware حماية المسارات على جميع المسارات
router.use(protectionMiddleware);

// مسارات قوالب التقارير
router.route('/')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posReportController.getAllReportTemplates)
  .post(restrictTo('Admin', 'Manager'), posReportController.createReportTemplate);

router.route('/:id')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posReportController.getReportTemplate)
  .patch(restrictTo('Admin', 'Manager'), posReportController.updateReportTemplate)
  .delete(restrictTo('Admin'), posReportController.deleteReportTemplate);

router.route('/:id/toggle')
  .patch(restrictTo('Admin', 'Manager'), posReportController.toggleReportTemplate);

router.route('/:id/generate-sample')
  .post(restrictTo('Admin', 'Manager'), posReportController.generateSampleReport);

router.route('/:id/schedule')
  .post(restrictTo('Admin', 'Manager'), posReportController.scheduleReport);

router.route('/:id/unschedule')
  .post(restrictTo('Admin', 'Manager'), posReportController.unscheduleReport);

router.route('/update-order')
  .patch(restrictTo('Admin', 'Manager'), posReportController.updateTemplatesOrder);

router.route('/stats')
  .get(restrictTo('Admin', 'Manager'), posReportController.getReportTemplatesStats);

module.exports = router;
