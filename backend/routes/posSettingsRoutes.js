const express = require('express');
const router = express.Router();
const posSettingsController = require('../controllers/posSettingsController');
const protectionMiddleware = require('../middlewares/protectionMiddleware');
const restrictTo = require('../middlewares/restrictionMiddleware');

// تطبيق middleware حماية المسارات على جميع المسارات
router.use(protectionMiddleware);

// مسارات إعدادات نقاط البيع
router.route('/:category')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posSettingsController.getSettingsByCategory)
  .post(restrictTo('Admin', 'Manager'), posSettingsController.saveSettingsByCategory);

router.route('/:category/:key')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posSettingsController.getSetting)
  .patch(restrictTo('Admin', 'Manager'), posSettingsController.updateSetting)
  .delete(restrictTo('Admin'), posSettingsController.deleteSetting);

router.route('/copy-to-branch')
  .post(restrictTo('Admin', 'Manager'), posSettingsController.copySettingsToBranch);

router.route('/:category/:branchId/reset')
  .post(restrictTo('Admin'), posSettingsController.resetSettingsToDefault);

module.exports = router;
