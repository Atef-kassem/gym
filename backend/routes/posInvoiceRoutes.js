const express = require('express');
const router = express.Router();
const posInvoiceController = require('../controllers/posInvoiceController');
const protectionMiddleware = require('../middlewares/protectionMiddleware');
const restrictTo = require('../middlewares/restrictionMiddleware');

// تطبيق middleware حماية المسارات على جميع المسارات
router.use(protectionMiddleware);

// مسارات قوالب الإيصالات
router.route('/')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posInvoiceController.getAllInvoiceTemplates)
  .post(restrictTo('Admin', 'Manager'), posInvoiceController.createInvoiceTemplate);

router.route('/:id')
  .get(restrictTo('Admin', 'Manager', 'Super Admin'), posInvoiceController.getInvoiceTemplate)
  .patch(restrictTo('Admin', 'Manager'), posInvoiceController.updateInvoiceTemplate)
  .delete(restrictTo('Admin'), posInvoiceController.deleteInvoiceTemplate);

router.route('/:id/set-default')
  .patch(restrictTo('Admin', 'Manager'), posInvoiceController.setDefaultTemplate);

router.route('/:id/duplicate')
  .post(restrictTo('Admin', 'Manager'), posInvoiceController.duplicateTemplate);

router.route('/:id/preview')
  .post(restrictTo('Admin', 'Manager', 'Super Admin'), posInvoiceController.previewTemplate);

router.route('/update-order')
  .patch(restrictTo('Admin', 'Manager'), posInvoiceController.updateTemplatesOrder);

router.route('/stats')
  .get(restrictTo('Admin', 'Manager'), posInvoiceController.getTemplatesStats);

module.exports = router;
