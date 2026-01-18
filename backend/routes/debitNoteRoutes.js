const express = require('express');
const router = express.Router();
const debitNoteController = require('../controllers/debitNoteController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

// جميع المسارات تتطلب تسجيل الدخول
router.use(isLoggedIn);

// إنشاء إشعار مدين جديد
router.post('/', debitNoteController.create);

// جلب قائمة إشعارات المدين
router.get('/', debitNoteController.list);

// جلب إشعار مدين واحد
router.get('/:id', debitNoteController.getById);

// تحديث إشعار مدين
router.put('/:id', debitNoteController.update);

// حذف إشعار مدين
router.delete('/:id', debitNoteController.remove);

// تغيير حالة إشعار المدين
router.patch('/:id/status', debitNoteController.changeStatus);

// إرسال إشعار المدين للمورد
router.post('/:id/send', debitNoteController.sendToSupplier);

// جلب إحصائيات إشعارات المدين
router.get('/stats', debitNoteController.getStats);

module.exports = router;
