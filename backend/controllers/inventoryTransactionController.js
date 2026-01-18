const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const inventoryTransactionRepository = require("../Model/repository/inventoryTransactionRepository");

class InventoryTransactionController {
  // جلب جميع الحركات المخزنية
  getAllTransactions = catchAsync(async (req, res) => {
    const {
      page = 1,
      limit = 50,
      type,
      status,
      branchId,
      warehouseId,
      userId,
      dateFrom,
      dateTo,
      search
    } = req.query;

    const filters = {
      type,
      status,
      branchId,
      warehouseId,
      userId,
      dateFrom,
      dateTo,
      search
    };

    const result = await inventoryTransactionRepository.getAllTransactions(filters, page, limit);

    res.status(200).json({
      status: "success",
      data: result
    });
  });

  // جلب حركة مخزنية واحدة
  getTransactionById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const transaction = await inventoryTransactionRepository.getTransactionById(id);

    res.status(200).json({
      status: "success",
      data: transaction
    });
  });

  // إنشاء حركة مخزنية جديدة
  createTransaction = catchAsync(async (req, res) => {
    const {
      type,
      date,
      time,
      sourceWarehouse,
      targetWarehouse,
      reference,
      user,
      status = "مسودة",
      items,
      notes,
      reason,
      branchId,
      branchName
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!type || !date || !time || !items || !items.length || !branchId) {
      throw new AppError("جميع الحقول المطلوبة يجب تعبئتها", 400);
    }

    // التحقق من المستودعات المطلوبة حسب نوع الحركة
    const isReceivingTransaction = type === "استلام" || type === "توريد" || type === "مرتجع مشتريات";
    const isExportTransaction = type === "صرف" || type === "إخراج" || type === "إتلاف" || type === "شطب" || type === "مرتجع مبيعات" || type === "جرد" || type === "تعديل";
    const isTransferTransaction = type === "تحويل";

    if (isReceivingTransaction && !targetWarehouse) {
      throw new AppError("يجب تحديد المستودع المستهدف لحركة الاستلام", 400);
    }

    if (isExportTransaction && !sourceWarehouse) {
      throw new AppError("يجب تحديد المستودع المصدر لحركة الصرف", 400);
    }

    if (isTransferTransaction && (!sourceWarehouse || !targetWarehouse)) {
      throw new AppError("يجب تحديد المستودع المصدر والمستودع المستقبل للتحويل", 400);
    }

    // إنشاء ID جديد
    const newId = `INV-${Date.now()}`;

    // تحضير بيانات الحركة
    // في حركات الاستلام: نستخدم targetWarehouse كمصدر افتراضي لأن الحقل إلزامي في قاعدة البيانات
    const transactionData = {
      id: newId,
      type,
      date,
      time,
      // في حركات الاستلام: sourceWarehouse يكون نفسه targetWarehouse
      sourceWarehouseId: sourceWarehouse || targetWarehouse || "N/A",
      sourceWarehouseName: req.body.sourceWarehouseName || req.body.targetWarehouseName || "N/A",
      targetWarehouseId: targetWarehouse || null,
      targetWarehouseName: req.body.targetWarehouseName || null,
      reference: reference || `AUTO-${Date.now()}`,
      userId: req.user?.id || user,
      userName: user,
      status,
      notes,
      reason,
      branchId,
      branchName,
      totalAmount: items.reduce((sum, item) => sum + (item.total || 0), 0)
    };

    const transaction = await inventoryTransactionRepository.createTransaction(
      transactionData, 
      items, 
      req.user?.id || req.body?.userId || "system"
    );

    res.status(201).json({
      status: "success",
      message: "تم إنشاء الحركة المخزنية بنجاح",
      data: transaction
    });
  });

  // تحديث حركة مخزنية
  updateTransaction = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // التحقق من وجود المستخدم
    const userId = req.user?.id || req.user?._id || res.locals.user?.id || res.locals.user?._id || req.body?.userId || "system";

    // تحضير بيانات التحديث
    const transactionUpdateData = {
      type: updateData.type,
      date: updateData.date,
      time: updateData.time,
      sourceWarehouseId: updateData.sourceWarehouse,
      sourceWarehouseName: updateData.sourceWarehouseName || updateData.sourceWarehouse,
      targetWarehouseId: updateData.targetWarehouse,
      targetWarehouseName: updateData.targetWarehouseName || updateData.targetWarehouse,
      reference: updateData.reference,
      notes: updateData.notes,
      reason: updateData.reason,
      totalAmount: updateData.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0
    };

    const updatedTransaction = await inventoryTransactionRepository.updateTransaction(
      id,
      transactionUpdateData,
      updateData.items || [],
      userId
    );

    res.status(200).json({
      status: "success",
      message: "تم تحديث الحركة المخزنية بنجاح",
      data: updatedTransaction
    });
  });

  // حذف حركة مخزنية
  deleteTransaction = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    // التحقق من وجود المستخدم
    const userId = req.user?.id || req.user?._id || res.locals.user?.id || res.locals.user?._id || req.body?.userId || "system";
    
    const result = await inventoryTransactionRepository.deleteTransaction(id, userId);

    res.status(200).json({
      status: "success",
      message: result.message
    });
  });

  // اعتماد حركة مخزنية
  approveTransaction = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    // الحصول على معرف المستخدم مع قيمة افتراضية
    const userId = req.user?.id || req.user?._id || res.locals.user?.id || res.locals.user?._id || req.body?.userId || "system";
    
    const transaction = await inventoryTransactionRepository.approveTransaction(id, userId);

    res.status(200).json({
      status: "success",
      message: "تم اعتماد الحركة المخزنية بنجاح",
      data: transaction
    });
  });

  // رفض حركة مخزنية
  rejectTransaction = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new AppError("يجب تحديد سبب الرفض", 400);
    }

    // الحصول على معرف المستخدم مع قيمة افتراضية
    const userId = req.user?.id || req.user?._id || res.locals.user?.id || res.locals.user?._id || req.body?.userId || "system";

    const transaction = await inventoryTransactionRepository.rejectTransaction(id, reason, userId);

    res.status(200).json({
      status: "success",
      message: "تم رفض الحركة المخزنية بنجاح",
      data: transaction
    });
  });

  // جلب إحصائيات الحركات المخزنية
  getTransactionStats = catchAsync(async (req, res) => {
    const { branchId, dateFrom, dateTo } = req.query;

    const filters = {
      branchId,
      dateFrom,
      dateTo
    };

    try {
      const stats = await inventoryTransactionRepository.getTransactionStats(filters);

      res.status(200).json({
        status: "success",
        data: stats
      });
    } catch (error) {
      console.error("Error in getTransactionStats:", error);
      res.status(200).json({
        status: "success",
        data: {
          totalItems: 0,
          transactionsByType: {},
          totalTransactions: 0
        }
      });
    }
  });

  // جلب أنواع الحركات
  getTransactionTypes = catchAsync(async (req, res) => {
    const types = [
      { value: "استلام", label: "استلام / توريد", icon: "TrendingUp", color: "text-green-600" },
      { value: "صرف", label: "صرف / إخراج", icon: "TrendingDown", color: "text-red-600" },
      { value: "تحويل", label: "تحويل بين المستودعات", icon: "ArrowRightLeft", color: "text-blue-600" },
      { value: "جرد", label: "جرد وتعديل", icon: "Package", color: "text-purple-600" },
      { value: "إتلاف", label: "إتلاف / شطب", icon: "Trash2", color: "text-orange-600" },
      { value: "مرتجع مشتريات", label: "مرتجع مشتريات", icon: "ArrowLeft", color: "text-indigo-600" },
      { value: "مرتجع مبيعات", label: "مرتجع مبيعات", icon: "ArrowRightLeft", color: "text-teal-600" }
    ];

    res.status(200).json({
      status: "success",
      data: { types }
    });
  });

  // جلب وحدات القياس
  getUnits = catchAsync(async (req, res) => {
    const units = ["  ", "لتر", "كيلو", "عبوة", "متر", "صندوق", "كرتون", "طن", "جرام"];

    res.status(200).json({
      status: "success",
      data: { units }
    });
  });

  // إضافة مرفق لحركة مخزنية
  addAttachment = catchAsync(async (req, res) => {
    const { transactionId } = req.params;
    const attachmentData = req.body;

    if (!req.file) {
      throw new AppError("يجب رفع ملف", 400);
    }

    const attachment = await inventoryTransactionRepository.addAttachment(
      transactionId,
      {
        id: `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transactionId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      },
      req.user?.id
    );

    res.status(201).json({
      status: "success",
      message: "تم إضافة المرفق بنجاح",
      data: attachment
    });
  });

  // حذف مرفق من حركة مخزنية
  removeAttachment = catchAsync(async (req, res) => {
    const { attachmentId } = req.params;
    const result = await inventoryTransactionRepository.removeAttachment(attachmentId, req.user?.id);

    res.status(200).json({
      status: "success",
      message: result.message
    });
  });

  // جلب سجل التغييرات لحركة مخزنية
  getTransactionLogs = catchAsync(async (req, res) => {
    const { transactionId } = req.params;
    const { limit = 50 } = req.query;

    const logs = await inventoryTransactionRepository.getTransactionLogs(transactionId, limit);

    res.status(200).json({
      status: "success",
      data: { logs }
    });
  });
}

module.exports = new InventoryTransactionController();
