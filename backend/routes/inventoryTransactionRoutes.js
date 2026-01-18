const express = require("express");
const router = express.Router();
const inventoryTransactionController = require("../controllers/inventoryTransactionController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// حماية جميع الروتات
router.use(isLoggedIn);

// روتات للبيانات المساعدة - يجب أن تكون قبل المسارات التي تحتوي على :id
router.get("/stats", inventoryTransactionController.getTransactionStats);     // إحصائيات
router.get("/types", inventoryTransactionController.getTransactionTypes);     // أنواع الحركات
router.get("/units", inventoryTransactionController.getUnits);               // وحدات القياس

// الروتات الأساسية للحركات المخزنية
router.route("/")
  .get(inventoryTransactionController.getAllTransactions)  // جلب جميع الحركات
  .post(inventoryTransactionController.createTransaction); // إنشاء حركة جديدة

// الروتات الخاصة بحركة واحدة
router.route("/:id")
  .get(inventoryTransactionController.getTransactionById)   // جلب حركة واحدة
  .put(inventoryTransactionController.updateTransaction)    // تحديث حركة
  .delete(inventoryTransactionController.deleteTransaction); // حذف حركة

// روتات خاصة للإجراءات
router.patch("/:id/approve", inventoryTransactionController.approveTransaction); // اعتماد حركة
router.patch("/:id/reject", inventoryTransactionController.rejectTransaction);   // رفض حركة

// روتات للمرفقات
router.post("/:transactionId/attachments", inventoryTransactionController.addAttachment); // إضافة مرفق
router.delete("/attachments/:attachmentId", inventoryTransactionController.removeAttachment); // حذف مرفق

// روتات لسجل التغييرات
router.get("/:transactionId/logs", inventoryTransactionController.getTransactionLogs); // جلب سجل التغييرات

module.exports = router;
