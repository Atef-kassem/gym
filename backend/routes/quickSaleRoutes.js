const express = require("express");
const router = express.Router();
const { QuickSale, Branch, Customer } = require("../Model/index");
const { Op } = require("sequelize");
const errorLogger = require("../utils/errorLogger");

// GET /api/quick-sales - جلب جميع المبيعات السريعة
router.get("/", async (req, res) => {
  try {
    console.log("📊 جلب المبيعات السريعة - Query params:", req.query);
    
    const { 
      branchId, 
      status, 
      paymentMethod,
      dateFrom,
      dateTo,
      limit = 50, 
      offset = 0 
    } = req.query;
    
    const whereClause = {};
    
    if (branchId) {
      whereClause.branchId = branchId;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }
    
    if (dateFrom && dateTo) {
      whereClause.saleDate = {
        [Op.between]: [dateFrom, dateTo]
      };
    } else if (dateFrom) {
      whereClause.saleDate = {
        [Op.gte]: dateFrom
      };
    } else if (dateTo) {
      whereClause.saleDate = {
        [Op.lte]: dateTo
      };
    }
    
    console.log("📊 Where clause:", whereClause);
    
    const sales = await QuickSale.findAll({
      where: whereClause,
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const total = await QuickSale.count({ where: whereClause });
    
    console.log(`✅ تم جلب ${sales.length} عملية بيع من أصل ${total}`);
    console.log("📊 أول 3 مبيعات:", sales.slice(0, 3).map(s => ({
      id: s.id,
      saleNumber: s.saleNumber,
      totalAmount: s.totalAmount
    })));
    
    res.json({
      success: true,
      data: sales,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/v1/quick-sales',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المبيعات السريعة'
    });
  }
});

// GET /api/quick-sales/:id - جلب بيع محدد
router.get("/:id", async (req, res) => {
  try {
    const sale = await QuickSale.findByPk(req.params.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'البيع غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `GET /api/v1/quick-sales/${req.params.id}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات البيع'
    });
  }
});

// POST /api/quick-sales - إنشاء بيع سريع جديد
router.post("/", async (req, res) => {
  const sequelize = require("../Config/sequelize");
  const { productsSchema: Product, Consumables, Service } = require("../Model/index");
  
  // استخدام transaction للتأكد من تنفيذ جميع العمليات أو إلغاؤها
  const transaction = await sequelize.transaction();
  
  try {
    errorLogger.logInfo("🚀 بدء إنشاء بيع سريع جديد", {
      body: req.body,
      ip: req.ip
    });

    const { 
      customerId,
      customerName, 
      customerPhone, 
      branchId, 
      items,
      subtotal,
      discountAmount,
      discountPercentage,
      taxAmount,
      taxPercentage,
      totalAmount,
      paymentMethod,
      paymentDetails,
      notes,
      loyaltyPointsUsed
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!branchId || !items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'يرجى تحديد الفرع والمنتجات'
      });
    }

    // التحقق من وجود الفرع
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'الفرع المحدد غير موجود'
      });
    }

    // =====================================================
    // خصم الكميات من المخزون
    // =====================================================
    const inventoryErrors = [];
    const inventoryUpdates = [];
    
    for (const item of items) {
      const itemType = item.type; // 'product' أو 'service'
      const itemId = item.id;
      const quantity = item.quantity || 1;
      
      if (itemType === 'product') {
        // البحث في جدول المنتجات
        const product = await Product.findOne({
          where: { product_id: itemId },
          transaction
        });
        
        if (product) {
          const currentStock = product.current_stock || 0;
          
          if (currentStock < quantity) {
            inventoryErrors.push({
              item: item.name,
              code: item.code,
              available: currentStock,
              requested: quantity
            });
          } else {
            // تقليل الكمية
            await product.update({
              current_stock: currentStock - quantity
            }, { transaction });
            
            inventoryUpdates.push({
              type: 'product',
              id: itemId,
              name: item.name,
              oldStock: currentStock,
              newStock: currentStock - quantity
            });
            
            errorLogger.logInfo(`📦 تم خصم ${quantity} من المنتج ${item.name}`, {
              productId: itemId,
              oldStock: currentStock,
              newStock: currentStock - quantity
            });
          }
        } else {
          // البحث في جدول المواد المستهلكة بدلاً من ذلك
          const consumable = await Consumables.findOne({
            where: { id: itemId },
            transaction
          });
          
          if (consumable) {
            const currentStock = consumable.currentStock || 0;
            
            if (currentStock < quantity) {
              inventoryErrors.push({
                item: item.name,
                code: item.code,
                available: currentStock,
                requested: quantity
              });
            } else {
              // تقليل الكمية
              await consumable.update({
                currentStock: currentStock - quantity
              }, { transaction });
              
              inventoryUpdates.push({
                type: 'consumable',
                id: itemId,
                name: item.name,
                oldStock: currentStock,
                newStock: currentStock - quantity
              });
              
              errorLogger.logInfo(`🧪 تم خصم ${quantity} من المادة المستهلكة ${item.name}`, {
                consumableId: itemId,
                oldStock: currentStock,
                newStock: currentStock - quantity
              });
            }
          }
        }
      } 
      else if (itemType === 'service') {
        // البحث عن المواد المستهلكة المرتبطة بهذه الخدمة
        const { ServiceConsumables: ServiceConsumablesModel } = require("../Model/index");
        
        const serviceConsumables = await ServiceConsumablesModel.findAll({
          where: { 
            serviceId: itemId,
            isActive: true 
          },
          include: [
            {
              model: Consumables,
              as: 'consumable'
            }
          ],
          transaction
        });
        
        if (serviceConsumables && serviceConsumables.length > 0) {
          // خصم المواد المستهلكة لهذه الخدمة
          for (const sc of serviceConsumables) {
            const consumable = sc.consumable;
            if (!consumable) continue;
            
            const requiredQuantity = parseFloat(sc.quantity) * quantity; // كمية المادة × عدد مرات الخدمة
            const currentStock = consumable.currentStock || 0;
            
            if (!sc.isOptional && currentStock < requiredQuantity) {
              // مادة إلزامية وغير متوفرة بالكمية المطلوبة
              inventoryErrors.push({
                item: `${item.name} - ${consumable.nameAr || consumable.nameEn}`,
                code: consumable.code,
                available: currentStock,
                requested: requiredQuantity
              });
            } else if (currentStock >= requiredQuantity) {
              // خصم المادة المستهلكة
              await consumable.update({
                currentStock: currentStock - requiredQuantity
              }, { transaction });
              
              inventoryUpdates.push({
                type: 'service_consumable',
                serviceId: itemId,
                serviceName: item.name,
                consumableId: consumable.id,
                consumableName: consumable.nameAr || consumable.nameEn,
                oldStock: currentStock,
                newStock: currentStock - requiredQuantity,
                quantity: requiredQuantity
              });
              
              errorLogger.logInfo(`⚙️🧪 تم خصم ${requiredQuantity} من المادة ${consumable.nameAr || consumable.nameEn} للخدمة ${item.name}`, {
                serviceId: itemId,
                consumableId: consumable.id,
                oldStock: currentStock,
                newStock: currentStock - requiredQuantity
              });
            } else if (sc.isOptional) {
              // مادة اختيارية وغير متوفرة - تجاهل
              errorLogger.logInfo(`⚠️ مادة اختيارية غير متوفرة للخدمة ${item.name}: ${consumable.nameAr || consumable.nameEn}`, {
                available: currentStock,
                requested: requiredQuantity
              });
            }
          }
        } else {
          errorLogger.logInfo(`⚙️ خدمة تم بيعها بدون مواد مستهلكة: ${item.name}`, {
            serviceId: itemId
          });
        }
      }
    }
    
    // إذا كانت هناك أخطاء في المخزون، إلغاء العملية
    if (inventoryErrors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'المخزون غير كافٍ لبعض المنتجات',
        errors: inventoryErrors
      });
    }

    // إنشاء رقم البيع
    const saleNumber = `QS${Date.now()}`;
    errorLogger.logInfo("🏷️ تم إنشاء رقم البيع", { saleNumber });

    // الحصول على تاريخ ووقت البيع الحالي
    const now = new Date();
    const saleDate = now.toISOString().split('T')[0];
    const saleTime = now.toTimeString().split(' ')[0];

    // حساب نقاط الولاء المكتسبة (1 نقطة لكل 10 جنيه)
    const loyaltyPointsEarned = Math.floor(totalAmount / 10);

    // تحضير بيانات البيع
    const saleData = {
      saleNumber,
      customerId: customerId || null,
      customerName: customerName || 'عميل نقدي',
      customerPhone: customerPhone || null,
      branchId,
      saleDate,
      saleTime,
      items,
      subtotal: parseFloat(subtotal) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      discountPercentage: parseFloat(discountPercentage) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      taxPercentage: parseFloat(taxPercentage) || 15,
      totalAmount: parseFloat(totalAmount),
      paymentMethod: paymentMethod || 'cash',
      paymentDetails: paymentDetails || null,
      status: 'completed',
      notes: notes || '',
      loyaltyPointsEarned,
      loyaltyPointsUsed: loyaltyPointsUsed || 0,
      receiptPrinted: false
    };

    errorLogger.logInfo("📝 بيانات البيع المحضرة", saleData);

    // إنشاء البيع في قاعدة البيانات
    const sale = await QuickSale.create(saleData, { transaction });
    
    // تحديث جلسة الوردية الحالية إذا كانت موجودة
    try {
      const { ShiftSession, Shift } = require("../Model/index");
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 8); // HH:MM:SS
      
      // البحث عن جلسة وردية مفتوحة لهذا الفرع في نفس اليوم
      let activeSession = await ShiftSession.findOne({
        where: {
          branchId: branchId,
          sessionDate: today,
          status: 'open'
        },
        include: [{
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime']
        }],
        transaction
      });
      
      // إذا لم تكن هناك جلسة مفتوحة، نبحث عن آخر جلسة مغلقة لهذا اليوم
      if (!activeSession) {
        // البحث عن آخر جلسة لهذا الفرع في نفس اليوم
        activeSession = await ShiftSession.findOne({
          where: {
            branchId: branchId,
            sessionDate: today
          },
          include: [{
            model: Shift,
            as: 'shift',
            attributes: ['id', 'shiftName', 'startTime', 'endTime']
          }],
          order: [['createdAt', 'DESC']],
          transaction
        });
      }
      
      if (activeSession) {
        // إعادة حساب مبيعات الجلسة - نستخدم نفس المنطق من calculateSessionSales
        const quickSalesWhere = {
          saleDate: activeSession.sessionDate,
          status: 'completed'
        };
        
        if (activeSession.branchId) {
          quickSalesWhere.branchId = activeSession.branchId;
        }
        
        const allQuickSales = await QuickSale.findAll({
          where: quickSalesWhere,
          transaction
        });
        
        // فلتر المبيعات حسب وقت الوردية
        // إذا كانت الجلسة مغلقة، نأخذ جميع المبيعات في نفس اليوم ونفس الوقت
        const shiftQuickSales = allQuickSales.filter(sale => {
          if (!sale.saleTime) return false;
          const saleTime = sale.saleTime.substring(0, 8);
          
          // إذا كانت الجلسة مغلقة، نتحقق من أن وقت البيع يقع ضمن وقت الوردية
          const shiftStartTime = activeSession.shift?.startTime || activeSession.expectedStartTime;
          const shiftEndTime = activeSession.shift?.endTime || activeSession.expectedEndTime;
          
          if (shiftStartTime > shiftEndTime) {
            // وردية تعبر منتصف الليل
            return saleTime >= shiftStartTime || saleTime <= shiftEndTime;
          } else {
            // وردية عادية
            return saleTime >= shiftStartTime && saleTime <= shiftEndTime;
          }
        });
        
        // جلب البيع
        const bookingsWhere = {
          bookingDate: activeSession.sessionDate,
          status: { [Op.in]: ['confirmed', 'completed'] }
        };
        
        if (activeSession.branchId) {
          bookingsWhere.branchId = activeSession.branchId;
        }
        
        const { Booking } = require("../Model/index");
        const allBookings = await Booking.findAll({
          where: bookingsWhere,
          transaction
        });
        
        // فلتر البيع حسب وقت الوردية
        const shiftStartTime = activeSession.shift?.startTime || activeSession.expectedStartTime;
        const shiftEndTime = activeSession.shift?.endTime || activeSession.expectedEndTime;
        
        const shiftBookings = allBookings.filter(booking => {
          if (!booking.bookingTime) return false;
          const bookingTime = booking.bookingTime.substring(0, 8);
          
          if (shiftStartTime > shiftEndTime) {
            return bookingTime >= shiftStartTime || bookingTime <= shiftEndTime;
          } else {
            return bookingTime >= shiftStartTime && bookingTime <= shiftEndTime;
          }
        });
        
        // حساب الإجماليات
        const quickSalesTotal = shiftQuickSales.reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
        const bookingsTotal = shiftBookings.reduce((sum, b) => sum + parseFloat(b.finalAmount || 0), 0);
        const totalSales = quickSalesTotal + bookingsTotal;
        
        // حساب طرق الدفع
        const totalCash = shiftQuickSales.filter(s => s.paymentMethod === 'cash')
          .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
        const totalCard = shiftQuickSales.filter(s => s.paymentMethod === 'card')
          .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
        const totalWallet = shiftQuickSales.filter(s => s.paymentMethod === 'wallet')
          .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
        const totalTransfer = shiftQuickSales.filter(s => s.paymentMethod === 'transfer')
          .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
        
        const totalDiscount = shiftQuickSales.reduce((sum, s) => sum + parseFloat(s.discountAmount || 0), 0);
        const totalTax = shiftQuickSales.reduce((sum, s) => sum + parseFloat(s.taxAmount || 0), 0);
        const transactionsCount = shiftQuickSales.length + shiftBookings.length;
        
        // بيانات التقرير
        const reportData = {
          quickSales: shiftQuickSales.map(sale => ({
            id: sale.id,
            saleNumber: sale.saleNumber,
            time: sale.saleTime,
            customerName: sale.customerName,
            totalAmount: parseFloat(sale.totalAmount || 0),
            paymentMethod: sale.paymentMethod,
            items: sale.items
          })),
          bookings: shiftBookings.map(booking => ({
            id: booking.id,
            bookingNumber: booking.bookingNumber || `BK${booking.id.toString().padStart(10, '0')}`,
            time: booking.bookingTime,
            customerName: booking.customerName,
            totalAmount: parseFloat(booking.finalAmount || 0),
            status: booking.status
          }))
        };
        
        const salesData = {
          totalSales,
          totalCash,
          totalCard,
          totalWallet,
          totalTransfer,
          totalDiscount,
          totalTax,
          transactionsCount,
          reportData
        };
        
        // تحديث الجلسة بالمبيعات الجديدة
        // إذا كانت الجلسة مغلقة، نعيد فتحها أو نحدثها فقط
        const updateData = {
          totalSales: salesData.totalSales,
          totalCash: salesData.totalCash,
          totalCard: salesData.totalCard,
          totalWallet: salesData.totalWallet,
          totalTransfer: salesData.totalTransfer,
          totalDiscount: salesData.totalDiscount,
          totalTax: salesData.totalTax,
          transactionsCount: salesData.transactionsCount,
          reportData: salesData.reportData,
          expectedClosingBalance: parseFloat(activeSession.openingBalance || 0) + parseFloat(salesData.totalCash || 0)
        };
        
        // إذا كانت الجلسة مغلقة تلقائياً وكانت المبيعات الجديدة بعد وقت الإغلاق، نعيد فتحها
        if (activeSession.status === 'auto_closed' && activeSession.endTime) {
          const endTime = new Date(activeSession.endTime);
          // استخدام وقت البيع الحالي
          const saleDateTime = new Date(`${saleDate}T${saleTime}`);
          
          // إذا كانت المبيعات بعد وقت الإغلاق، نعيد فتح الجلسة
          if (saleDateTime > endTime) {
            updateData.status = 'open';
            updateData.endTime = null; // إلغاء وقت الإغلاق
            errorLogger.logInfo("🔄 إعادة فتح جلسة وردية بسبب مبيعات جديدة", {
              sessionId: activeSession.id,
              saleDateTime: saleDateTime.toISOString(),
              endTime: endTime.toISOString()
            });
          }
        }
        
        await activeSession.update(updateData, { transaction });
        
        errorLogger.logInfo("✅ تم تحديث جلسة الوردية", {
          sessionId: activeSession.id,
          status: activeSession.status,
          newTotalSales: salesData.totalSales,
          transactionsCount: salesData.transactionsCount
        });
      } else {
        errorLogger.logInfo("ℹ️ لا توجد جلسة وردية مفتوحة لتحديثها", {
          branchId,
          date: today
        });
      }
    } catch (sessionError) {
      // لا نوقف العملية إذا فشل تحديث الجلسة
      errorLogger.logError(sessionError, {
        endpoint: 'POST /api/v1/quick-sales - تحديث جلسة الوردية',
        saleId: sale.id
      });
      console.warn('⚠️ تحذير: لم يتم تحديث جلسة الوردية:', sessionError.message);
    }
    
    // تأكيد جميع التغييرات
    await transaction.commit();
    
    errorLogger.logSuccess("✅ تم إنشاء البيع وخصم المخزون بنجاح", {
      saleId: sale.id,
      saleNumber: sale.saleNumber,
      totalAmount: sale.totalAmount,
      inventoryUpdates: inventoryUpdates
    });

    // جلب البيع مع العلاقات
    const createdSale = await QuickSale.findByPk(sale.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء البيع وخصم المخزون بنجاح',
      data: createdSale,
      inventoryUpdates: inventoryUpdates
    });
  } catch (error) {
    // إلغاء جميع التغييرات في حالة حدوث خطأ
    await transaction.rollback();
    
    const errorId = errorLogger.logError(error, {
      endpoint: 'POST /api/v1/quick-sales',
      requestBody: req.body
    });

    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء البيع',
      errorId: errorId,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/quick-sales/:id - تحديث بيع (للإرجاع أو الإلغاء)
router.put("/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const sale = await QuickSale.findByPk(req.params.id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'البيع غير موجود'
      });
    }
    
    await sale.update({
      status: status || sale.status,
      notes: notes !== undefined ? notes : sale.notes
    });
    
    const updatedSale = await QuickSale.findByPk(req.params.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });
    
    res.json({
      success: true,
      message: 'تم تحديث البيع بنجاح',
      data: updatedSale
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `PUT /api/v1/quick-sales/${req.params.id}`,
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث البيع'
    });
  }
});

// GET /api/quick-sales/stats/summary - إحصائيات المبيعات
router.get("/stats/summary", async (req, res) => {
  try {
    const { branchId, dateFrom, dateTo } = req.query;
    
    const whereClause = {};
    
    if (branchId) {
      whereClause.branchId = branchId;
    }
    
    if (dateFrom && dateTo) {
      whereClause.saleDate = {
        [Op.between]: [dateFrom, dateTo]
      };
    }
    
    const sales = await QuickSale.findAll({
      where: whereClause,
      attributes: [
        'status',
        'paymentMethod',
        'totalAmount',
        'subtotal',
        'discountAmount',
        'taxAmount'
      ]
    });
    
    const stats = {
      totalSales: sales.length,
      completedSales: sales.filter(s => s.status === 'completed').length,
      refundedSales: sales.filter(s => s.status === 'refunded').length,
      totalRevenue: sales
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + parseFloat(s.totalAmount), 0),
      totalDiscount: sales.reduce((sum, s) => sum + parseFloat(s.discountAmount), 0),
      totalTax: sales.reduce((sum, s) => sum + parseFloat(s.taxAmount), 0),
      paymentMethods: {
        cash: sales.filter(s => s.paymentMethod === 'cash').length,
        card: sales.filter(s => s.paymentMethod === 'card').length,
        wallet: sales.filter(s => s.paymentMethod === 'wallet').length,
        transfer: sales.filter(s => s.paymentMethod === 'transfer').length,
        mixed: sales.filter(s => s.paymentMethod === 'mixed').length
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/v1/quick-sales/stats/summary',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإحصائيات'
    });
  }
});

// PUT /api/quick-sales/:id/print - تحديث حالة الطباعة
router.put("/:id/print", async (req, res) => {
  try {
    const sale = await QuickSale.findByPk(req.params.id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'البيع غير موجود'
      });
    }
    
    await sale.update({ receiptPrinted: true });
    
    res.json({
      success: true,
      message: 'تم تحديث حالة الطباعة'
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `PUT /api/v1/quick-sales/${req.params.id}/print`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة الطباعة'
    });
  }
});

module.exports = router;
