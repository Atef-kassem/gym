const { Op } = require("sequelize");
const { 
  InventoryTransaction, 
  InventoryTransactionItem, 
  InventoryTransactionAttachment, 
  InventoryTransactionLog 
} = require("../schema/inventoryTransactionSchema");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

class InventoryTransactionRepository {
  // إنشاء حركة مخزنية جديدة
  async createTransaction(transactionData, items = [], userId) {
    try {
      const transaction = await InventoryTransaction.create({
        ...transactionData,
        createdBy: userId
      });

      // إنشاء الأصناف المرتبطة
      if (items && items.length > 0) {
        const itemsWithTransactionId = items.map(item => ({
          ...item,
          transactionId: transaction.id,
          id: item.id || `ITM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));

        await InventoryTransactionItem.bulkCreate(itemsWithTransactionId);
      }

      // تسجيل العملية في السجل
      await InventoryTransactionLog.create({
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transactionId: transaction.id,
        action: 'created',
        newData: { ...transaction.toJSON(), items },
        changedBy: userId || "system",
        changeReason: 'إنشاء حركة مخزنية جديدة'
      });

      return transaction;
    } catch (error) {
      throw new AppError(`خطأ في إنشاء الحركة المخزنية: ${error.message}`, 500);
    }
  }

  // جلب جميع الحركات المخزنية مع فلترة
  async getAllTransactions(filters = {}, page = 1, limit = 50) {
    try {
      const where = {};
      const include = [
        {
          model: InventoryTransactionItem,
          as: 'items',
          attributes: ['id', 'itemCode', 'itemName', 'quantity', 'unit', 'price', 'total', 'notes', 'productId']
        }
      ];

      // فلترة حسب النوع
      if (filters.type && filters.type !== 'all') {
        where.type = filters.type;
      }

      // فلترة حسب الحالة
      if (filters.status && filters.status !== 'all') {
        where.status = filters.status;
      }

      // فلترة حسب الفرع
      if (filters.branchId && filters.branchId !== 'all') {
        where.branchId = filters.branchId;
      }

      // فلترة حسب المستودع
      if (filters.warehouseId && filters.warehouseId !== 'all') {
        where[Op.or] = [
          { sourceWarehouseId: filters.warehouseId },
          { targetWarehouseId: filters.warehouseId }
        ];
      }

      // فلترة حسب المستخدم
      if (filters.userId && filters.userId !== 'all') {
        where.userId = filters.userId;
      }

      // فلترة حسب التاريخ
      if (filters.dateFrom || filters.dateTo) {
        where.date = {};
        if (filters.dateFrom) {
          where.date[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          where.date[Op.lte] = filters.dateTo;
        }
      }

      // البحث النصي
      if (filters.search) {
        where[Op.or] = [
          { id: { [Op.like]: `%${filters.search}%` } },
          { reference: { [Op.like]: `%${filters.search}%` } },
          { userName: { [Op.like]: `%${filters.search}%` } },
          { branchName: { [Op.like]: `%${filters.search}%` } }
        ];
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await InventoryTransaction.findAndCountAll({
        where,
        include,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      return {
        transactions: rows,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(count / limit),
          count: rows.length,
          totalRecords: count
        }
      };
    } catch (error) {
      throw new AppError(`خطأ في جلب الحركات المخزنية: ${error.message}`, 500);
    }
  }

  // جلب حركة مخزنية واحدة
  async getTransactionById(id) {
    try {
      const transaction = await InventoryTransaction.findByPk(id, {
        include: [
          {
            model: InventoryTransactionItem,
            as: 'items',
            attributes: ['id', 'itemCode', 'itemName', 'quantity', 'unit', 'price', 'total', 'notes', 'productId']
          },
          {
            model: InventoryTransactionAttachment,
            as: 'attachments',
            attributes: ['id', 'fileName', 'filePath', 'fileSize', 'mimeType', 'uploadedBy', 'createdAt']
          },
          {
            model: InventoryTransactionLog,
            as: 'logs',
            attributes: ['id', 'action', 'oldData', 'newData', 'changedBy', 'changeReason', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 10
          }
        ]
      });

      if (!transaction) {
        throw new AppError('لم يتم العثور على الحركة المخزنية', 404);
      }

      return transaction;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`خطأ في جلب الحركة المخزنية: ${error.message}`, 500);
    }
  }

  // تحديث حركة مخزنية
  async updateTransaction(id, updateData, items = [], userId) {
    try {
      const transaction = await InventoryTransaction.findByPk(id);
      if (!transaction) {
        throw new AppError('لم يتم العثور على الحركة المخزنية', 404);
      }

      // التحقق من إمكانية التعديل
      if (transaction.status !== 'مسودة') {
        throw new AppError('لا يمكن تعديل الحركة إلا في حالة المسودة', 400);
      }

      const oldData = transaction.toJSON();

      // تحديث البيانات الأساسية
      await transaction.update({
        ...updateData,
        updatedBy: userId
      });

      // تحديث الأصناف إذا تم توفيرها
      if (items && items.length > 0) {
        // حذف الأصناف القديمة
        await InventoryTransactionItem.destroy({
          where: { transactionId: id }
        });

        // إنشاء الأصناف الجديدة
        const itemsWithTransactionId = items.map(item => ({
          ...item,
          transactionId: id,
          id: item.id || `ITM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));

        await InventoryTransactionItem.bulkCreate(itemsWithTransactionId);
      }

      // تسجيل العملية في السجل
      await InventoryTransactionLog.create({
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transactionId: id,
        action: 'updated',
        oldData,
        newData: { ...updateData, items },
        changedBy: userId,
        changeReason: 'تحديث الحركة المخزنية'
      });

      return await this.getTransactionById(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`خطأ في تحديث الحركة المخزنية: ${error.message}`, 500);
    }
  }

  // حذف حركة مخزنية
  async deleteTransaction(id, userId) {
    try {
      const transaction = await InventoryTransaction.findByPk(id);
      if (!transaction) {
        throw new AppError('لم يتم العثور على الحركة المخزنية', 404);
      }

      // التحقق من إمكانية الحذف
      if (transaction.status !== 'مسودة') {
        throw new AppError('لا يمكن حذف الحركة إلا في حالة المسودة', 400);
      }

      // تسجيل العملية في السجل قبل الحذف
      await InventoryTransactionLog.create({
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transactionId: id,
        action: 'deleted',
        oldData: transaction.toJSON(),
        changedBy: userId,
        changeReason: 'حذف الحركة المخزنية'
      });

      // حذف الحركة (سيتم حذف الأصناف والمرفقات تلقائياً بسبب CASCADE)
      await transaction.destroy();

      return { success: true, message: 'تم حذف الحركة المخزنية بنجاح' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`خطأ في حذف الحركة المخزنية: ${error.message}`, 500);
    }
  }

  // اعتماد حركة مخزنية
  async approveTransaction(id, userId) {
    const sequelize = require('../../Config/sequelize');
    const inventoryRepository = require('./inventoryRepository');
    
    // استخدام transaction لضمان تطبيق جميع التغييرات أو عدم تطبيقها
    const t = await sequelize.transaction();
    
    try {
      const transaction = await InventoryTransaction.findByPk(id, {
        include: [{
          model: InventoryTransactionItem,
          as: 'items'
        }],
        transaction: t
      });
      
      if (!transaction) {
        await t.rollback();
        throw new AppError('لم يتم العثور على الحركة المخزنية', 404);
      }

      if (transaction.status === 'معتمدة') {
        await t.rollback();
        throw new AppError('الحركة معتمدة بالفعل', 400);
      }

      const oldData = transaction.toJSON();

      // تحديث الكميات في المخزون بناءً على نوع الحركة
      console.log('🔄 بدء تحديث الكميات في المخزون...');
      console.log('📊 عدد الأصناف:', transaction.items.length);
      console.log('📊 نوع الحركة:', transaction.type);
      
      for (const item of transaction.items) {
        const productId = item.productId || item.itemCode;
        const quantity = Number(item.quantity) || 0;
        const warehouseId = transaction.sourceWarehouseId || transaction.targetWarehouseId;

        console.log('\n📦 معالجة صنف:', {
          itemName: item.itemName,
          productId,
          quantity,
          warehouseId,
          type: transaction.type
        });

        if (!warehouseId) {
          console.error('⚠️ لا يوجد معرف مستودع للحركة:', id);
          continue;
        }

        try {
          switch (transaction.type) {
            case 'استلام':
            case 'توريد':
            case 'مرتجع مشتريات':
              // إضافة كمية موجبة
              console.log(`➕ سيتم إضافة ${quantity} من المنتج ${productId} للمستودع ${warehouseId}`);
              const result1 = await inventoryRepository.updateStock(productId, warehouseId, quantity);
              console.log(`✅ تمت إضافة ${quantity} من المنتج ${productId} للمستودع ${warehouseId}`, result1);
              break;
              
            case 'صرف':
            case 'إخراج':
            case 'مرتجع مبيعات':
            case 'إتلاف':
            case 'شطب':
              // خصم كمية سالبة
              await inventoryRepository.updateStock(productId, warehouseId, -quantity);
              console.log(`✅ تم خصم ${quantity} من المنتج ${productId} من المستودع ${warehouseId}`);
              break;
              
            case 'جرد':
            case 'تعديل':
              // تعيين كمية جديدة
              await inventoryRepository.setStock(productId, warehouseId, quantity);
              console.log(`✅ تم تعيين كمية ${quantity} للمنتج ${productId} في المستودع ${warehouseId}`);
              break;
              
            case 'تحويل':
              // خصم من المستودع المصدر
              if (transaction.sourceWarehouseId) {
                await inventoryRepository.updateStock(productId, transaction.sourceWarehouseId, -quantity);
                console.log(`✅ تم خصم ${quantity} من المنتج ${productId} من المستودع ${transaction.sourceWarehouseId}`);
              }
              // إضافة للمستودع المستهدف
              if (transaction.targetWarehouseId) {
                await inventoryRepository.updateStock(productId, transaction.targetWarehouseId, quantity);
                console.log(`✅ تمت إضافة ${quantity} من المنتج ${productId} للمستودع ${transaction.targetWarehouseId}`);
              }
              break;
              
            default:
              console.warn(`⚠️ نوع حركة غير معروف: ${transaction.type}`);
          }
        } catch (stockError) {
          console.error('❌ خطأ في تحديث المخزون:', {
            productId,
            warehouseId,
            quantity,
            type: transaction.type,
            error: stockError.message
          });
          // الاستمرار في تحديث باقي الأصناف
        }
      }

      // تحديث حالة الحركة
      await transaction.update({
        status: 'معتمدة',
        approvedBy: userId,
        approvedAt: new Date(),
        updatedBy: userId
      }, { transaction: t });

      // تسجيل العملية في السجل
      await InventoryTransactionLog.create({
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transactionId: id,
        action: 'approved',
        oldData,
        newData: { status: 'معتمدة', approvedBy: userId, approvedAt: new Date() },
        changedBy: userId,
        changeReason: 'اعتماد الحركة المخزنية'
      }, { transaction: t });

      await t.commit();
      return transaction;
    } catch (error) {
      await t.rollback();
      if (error instanceof AppError) throw error;
      throw new AppError(`خطأ في اعتماد الحركة المخزنية: ${error.message}`, 500);
    }
  }

  // رفض حركة مخزنية
  async rejectTransaction(id, reason, userId) {
    try {
      const transaction = await InventoryTransaction.findByPk(id);
      if (!transaction) {
        throw new AppError('لم يتم العثور على الحركة المخزنية', 404);
      }

      if (transaction.status === 'معتمدة') {
        throw new AppError('لا يمكن رفض حركة معتمدة', 400);
      }

      const oldData = transaction.toJSON();

      await transaction.update({
        status: 'غير معتمدة',
        rejectedBy: userId,
        rejectedAt: new Date(),
        rejectionReason: reason,
        updatedBy: userId
      });

      // تسجيل العملية في السجل
      await InventoryTransactionLog.create({
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transactionId: id,
        action: 'rejected',
        oldData,
        newData: { 
          status: 'غير معتمدة', 
          rejectedBy: userId, 
          rejectedAt: new Date(),
          rejectionReason: reason
        },
        changedBy: userId,
        changeReason: `رفض الحركة المخزنية: ${reason}`
      });

      return transaction;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`خطأ في رفض الحركة المخزنية: ${error.message}`, 500);
    }
  }

  // جلب إحصائيات الحركات المخزنية
  async getTransactionStats(filters = {}) {
    try {
      const where = {};

      if (filters.branchId && filters.branchId !== 'all') {
        where.branchId = filters.branchId;
      }

      if (filters.dateFrom || filters.dateTo) {
        where.date = {};
        if (filters.dateFrom) {
          where.date[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          where.date[Op.lte] = filters.dateTo;
        }
      }

      const [
        totalTransactions,
        transactionsByType,
        transactionsByStatus,
        totalItems
      ] = await Promise.all([
        InventoryTransaction.count({ where }),
        InventoryTransaction.findAll({
          where,
          attributes: [
            'type',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          group: ['type']
        }),
        InventoryTransaction.findAll({
          where,
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          group: ['status']
        }),
        InventoryTransactionItem.count({
          include: [{
            model: InventoryTransaction,
            as: 'transaction',
            where
          }]
        })
      ]);

      // تنظيم البيانات
      const transactionsByTypeObj = {};
      transactionsByType.forEach(item => {
        transactionsByTypeObj[item.type] = parseInt(item.dataValues.count);
      });

      const transactionsByStatusObj = {};
      transactionsByStatus.forEach(item => {
        transactionsByStatusObj[item.status] = parseInt(item.dataValues.count);
      });

      return {
        totalTransactions,
        totalItems,
        transactionsByType: transactionsByTypeObj,
        transactionsByStatus: transactionsByStatusObj
      };
    } catch (error) {
      throw new AppError(`خطأ في جلب الإحصائيات: ${error.message}`, 500);
    }
  }

  // إضافة مرفق لحركة مخزنية
  async addAttachment(transactionId, attachmentData, userId) {
    try {
      const transaction = await InventoryTransaction.findByPk(transactionId);
      if (!transaction) {
        throw new AppError('لم يتم العثور على الحركة المخزنية', 404);
      }

      const attachment = await InventoryTransactionAttachment.create({
        ...attachmentData,
        uploadedBy: userId
      });

      return attachment;
    } catch (error) {
      throw new AppError(`خطأ في إضافة المرفق: ${error.message}`, 500);
    }
  }

  // حذف مرفق من حركة مخزنية
  async removeAttachment(attachmentId, userId) {
    try {
      const attachment = await InventoryTransactionAttachment.findByPk(attachmentId);
      if (!attachment) {
        throw new AppError('لم يتم العثور على المرفق', 404);
      }

      await attachment.destroy();
      return { success: true, message: 'تم حذف المرفق بنجاح' };
    } catch (error) {
      throw new AppError(`خطأ في حذف المرفق: ${error.message}`, 500);
    }
  }

  // جلب سجل التغييرات لحركة مخزنية
  async getTransactionLogs(transactionId, limit = 50) {
    try {
      const logs = await InventoryTransactionLog.findAll({
        where: { transactionId },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });

      return logs;
    } catch (error) {
      throw new AppError(`خطأ في جلب سجل التغييرات: ${error.message}`, 500);
    }
  }
}

module.exports = new InventoryTransactionRepository();
