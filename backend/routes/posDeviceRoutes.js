const express = require('express');
const router = express.Router();
const posDeviceController = require('../controllers/posDeviceController');
const protectionMiddleware = require('../middlewares/protectionMiddleware');
const restrictTo = require('../middlewares/restrictionMiddleware');

// تطبيق middleware حماية المسارات على جميع المسارات
router.use(protectionMiddleware);

// مسارات أجهزة نقاط البيع
router.route('/')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posDeviceController.getAllDevices)
  .post(restrictTo('Admin', 'Manager'), posDeviceController.createDevice);

router.route('/:id')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posDeviceController.getDevice)
  .patch(restrictTo('Admin', 'Manager'), posDeviceController.updateDevice)
  .delete(restrictTo('Admin'), posDeviceController.deleteDevice);

router.route('/:id/toggle-status')
  .patch(restrictTo('Admin', 'Manager'), posDeviceController.toggleDeviceStatus);

router.route('/sync')
  .post(restrictTo('Admin', 'Manager'), posDeviceController.syncDevices);

router.route('/stats')
  .get(restrictTo('Admin', 'Manager'), posDeviceController.getDeviceStats);

module.exports = router;
