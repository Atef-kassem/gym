const express = require("express");
const router = express.Router();
const { Table, Branch, Booking } = require("../Model/index");
const { Op } = require("sequelize");
const errorLogger = require("../utils/errorLogger");

// GET /api/bookings/time-slots - جلب الأوقات المتاحة
router.get("/time-slots", async (req, res) => {
  try {
    const { branchId, date } = req.query;
    
    if (!branchId || !date) {
      return res.status(400).json({
        success: false,
        message: 'معرف الفرع والتاريخ مطلوبان'
      });
    }

    // جلب جميع الطاولات في الفرع
    const tables = await Table.findAll({
      where: { 
        branchId: branchId,
        isActive: true 
      },
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });

    // جلب جميع البيع لهذا الفرع في التاريخ المحدد
    let bookings = [];
    try {
      bookings = await Booking.findAll({
        where: {
          branchId: branchId,
          bookingDate: date,
          status: {
            [Op.in]: ['pending', 'confirmed', 'in-progress']
          }
        }
      });
      console.log(`📊 Total bookings found: ${bookings.length}`);
    } catch (bookingError) {
      console.warn('⚠️ جدول BOOKINGS غير موجود أو يحتوي على خطأ:', bookingError.message);
      console.warn('⚠️ سيتم عرض جميع الأوقات كمتاحة');
      bookings = [];
    }

   

    // إنشاء الأوقات المتاحة (من 8:00 إلى 18:00)
    const timeSlots = [];
    const startHour = 8;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // حساب عدد الطاولات المحجوزة في هذا الوقت
        const totalTables = tables.length;
        const bookedTables = bookings.filter(booking => {
          // bookingTime يأتي من قاعدة البيانات كـ TIME، قد يكون بصيغة HH:MM:SS
          const bookingTime = booking.bookingTime;
          if (!bookingTime) return false;
          // استخراج HH:MM فقط للمقارنة
          const timeOnly = typeof bookingTime === 'string' 
            ? bookingTime.substring(0, 5) 
            : bookingTime;
          return timeOnly === timeString;
        }).length;
        const availableTables = totalTables - bookedTables;
        
        // تحديد حالة التوفر
        let status = 'available';
        let label = 'متاح بالكامل';
        
        if (bookedTables === totalTables) {
          status = 'fully_booked';
          label = 'محجوز بالكامل';
        } else if (bookedTables >= totalTables * 0.8) {
          status = 'busy';
          label = 'مزدحم';
        } else if (bookedTables > 0) {
          status = 'partially_available';
          label = 'متاح جزئياً';
        }
        
        timeSlots.push({
          time: timeString,
          status: status,
          label: label,
          bookedTables: bookedTables,
          totalTables: totalTables,
          availableTables: availableTables,
          occupancyRate: totalTables > 0 ? (bookedTables / totalTables) : 0
        });
      }
    }

    res.json({
      success: true,
      data: {
        timeSlots,
        branch: tables[0]?.branch || null,
        totalTables: tables.length,
        date: date
      }
    });
  } catch (error) {
    console.error('❌ Error fetching time slots:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأوقات المتاحة',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/bookings/availability - فحص توفر وقت محدد
router.get("/availability", async (req, res) => {
  try {
    const { branchId, date, time } = req.query;
    
    if (!branchId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'معرف الفرع والتاريخ والوقت مطلوبان'
      });
    }

    // جلب الطاولات المتاحة في هذا الوقت
    const tables = await Table.findAll({
      where: { 
        branchId: branchId,
        isActive: true,
        status: 'available'
      }
    });

    // محاكاة البيع (في الواقع ستأتي من جدول البيع)
    const totalTables = tables.length;
    const bookedTables = Math.floor(Math.random() * (totalTables + 1));
    const availableTables = totalTables - bookedTables;

    res.json({
      success: true,
      data: {
        time: time,
        date: date,
        totalTables: totalTables,
        availableTables: availableTables,
        bookedTables: bookedTables,
        isAvailable: availableTables > 0,
        occupancyRate: totalTables > 0 ? (bookedTables / totalTables) : 0
      }
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في فحص التوفر'
    });
  }
});

// POST /api/bookings - إنشاء حجز جديد
router.post("/", async (req, res) => {
  const sequelize = require("../Config/sequelize");
  const { productsSchema: Product, Consumables, Service, ServiceConsumables } = require("../Model/index");
  
  // استخدام transaction للتأكد من تنفيذ جميع العمليات أو إلغاؤها
  const transaction = await sequelize.transaction();
  
  try {
    errorLogger.logInfo("🚀 بدء إنشاء حجز جديد", {
      headers: req.headers,
      body: req.body,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      branchId, 
      tableId, 
      date, 
      time, 
      services,
      notes 
    } = req.body;

    errorLogger.logInfo("📋 البيانات المستلمة", {
      customerName,
      customerPhone,
      customerEmail,
      branchId,
      tableId,
      date,
      time,
      services,
      notes
    });

    // التحقق من صحة البيانات
    if (!customerName || !customerPhone || !branchId || !date || !time) {
      errorLogger.logWarning("❌ البيانات المطلوبة مفقودة", {
        customerName: !!customerName,
        customerPhone: !!customerPhone,
        branchId: !!branchId,
        date: !!date,
        time: !!time
      });
      
      return res.status(400).json({
        success: false,
        message: 'البيانات المطلوبة مفقودة'
      });
    }

    // التحقق من وجود الفرع
    errorLogger.logInfo("🔍 البحث عن الفرع", { branchId });
    const branch = await Branch.findByPk(branchId, { transaction });
    
    if (!branch) {
      await transaction.rollback();
      errorLogger.logWarning("❌ الفرع غير موجود", { branchId });
      return res.status(404).json({
        success: false,
        message: 'الفرع غير موجود'
      });
    }
    
    errorLogger.logSuccess("✅ تم العثور على الفرع", {
      branchId: branch.id,
      branchName: branch.arabicName || branch.englishName
    });

    // التحقق من وجود الطاولة إذا تم تحديدها
    let table = null;
    if (tableId) {
      errorLogger.logInfo("🔍 البحث عن الطاولة", { tableId });
      table = await Table.findByPk(tableId, { transaction });
      
      if (!table) {
        await transaction.rollback();
        errorLogger.logWarning("❌ الطاولة غير موجودة", { tableId });
        return res.status(404).json({
          success: false,
          message: 'الطاولة غير موجودة'
        });
      }

      errorLogger.logSuccess("✅ تم العثور على الطاولة", {
        tableId: table.id,
        tableName: table.name,
        tableStatus: table.status
      });

      // التحقق من توفر الطاولة
      if (table.status !== 'available') {
        await transaction.rollback();
        errorLogger.logWarning("❌ الطاولة غير متاحة", {
          tableId: table.id,
          currentStatus: table.status
        });
        return res.status(400).json({
          success: false,
          message: 'الطاولة غير متاحة'
        });
      }
    }
    
    // =====================================================
    // خصم المواد المستهلكة من المخزون
    // =====================================================
    const inventoryErrors = [];
    const inventoryUpdates = [];
    
    if (services && Array.isArray(services) && services.length > 0) {
      for (const item of services) {
        const itemType = item.type || 'service'; // افتراضياً خدمة
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
                code: item.code || item.id,
                available: currentStock,
                requested: quantity
              });
            } else {
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
            // البحث في جدول المواد المستهلكة
            const consumable = await Consumables.findOne({
              where: { id: itemId },
              transaction
            });
            
            if (consumable) {
              const currentStock = consumable.currentStock || 0;
              
              if (currentStock < quantity) {
                inventoryErrors.push({
                  item: item.name,
                  code: item.code || item.id,
                  available: currentStock,
                  requested: quantity
                });
              } else {
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
          const serviceConsumables = await ServiceConsumables.findAll({
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
            for (const sc of serviceConsumables) {
              const consumable = sc.consumable;
              if (!consumable) continue;
              
              const requiredQuantity = parseFloat(sc.quantity) * quantity;
              const currentStock = consumable.currentStock || 0;
              
              if (!sc.isOptional && currentStock < requiredQuantity) {
                inventoryErrors.push({
                  item: `${item.name} - ${consumable.nameAr || consumable.nameEn}`,
                  code: consumable.code,
                  available: currentStock,
                  requested: requiredQuantity
                });
              } else if (currentStock >= requiredQuantity) {
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
              }
            }
          }
        }
      }
    }
    
    // إذا كانت هناك أخطاء في المخزون، إلغاء العملية
    if (inventoryErrors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'المخزون غير كافٍ لبعض المنتجات/الخدمات',
        errors: inventoryErrors
      });
    }

    // إنشاء رقم الحجز
    const bookingNumber = `BK${Date.now()}`;
    errorLogger.logInfo("🏷️ تم إنشاء رقم الحجز", { bookingNumber });

    // تحضير بيانات الحجز
    const bookingData = {
      bookingNumber,
      customerName,
      customerPhone,
      customerEmail,
      branchId,
      tableId: tableId || null,
      bookingDate: date,
      bookingTime: time,
      status: 'confirmed',
      notes: notes || '',
      specialRequests: services || [],
      totalPrice: 0,
      finalAmount: 0,
      paymentStatus: 'unpaid'
    };

    errorLogger.logInfo("📝 بيانات الحجز المحضرة", bookingData);

    // إنشاء الحجز في قاعدة البيانات
    errorLogger.logInfo("💾 محاولة إنشاء الحجز في قاعدة البيانات...");
    const booking = await Booking.create(bookingData, { transaction });
    
    errorLogger.logSuccess("✅ تم إنشاء الحجز بنجاح", {
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber
    });

    // تحديث حالة الطاولة إذا تم تحديدها
    if (table) {
      await table.update({ status: 'reserved' }, { transaction });
    }
    
    // تحديث جلسة الوردية الحالية إذا كانت موجودة
    try {
      const { ShiftSession, Shift } = require("../Model/index");
      const { Op } = require("sequelize");
      const bookingDate = date;
      
      // البحث عن جلسة وردية مفتوحة لهذا الفرع في نفس اليوم
      let activeSession = await ShiftSession.findOne({
        where: {
          branchId: branchId,
          sessionDate: bookingDate,
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
        activeSession = await ShiftSession.findOne({
          where: {
            branchId: branchId,
            sessionDate: bookingDate
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
        // جلب جميع المبيعات السريعة
        const { QuickSale } = require("../Model/index");
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
        const shiftStartTime = activeSession.shift?.startTime || activeSession.expectedStartTime;
        const shiftEndTime = activeSession.shift?.endTime || activeSession.expectedEndTime;
        
        const shiftQuickSales = allQuickSales.filter(sale => {
          if (!sale.saleTime) return false;
          const saleTime = sale.saleTime.substring(0, 8);
          
          if (shiftStartTime > shiftEndTime) {
            return saleTime >= shiftStartTime || saleTime <= shiftEndTime;
          } else {
            return saleTime >= shiftStartTime && saleTime <= shiftEndTime;
          }
        });
        
        // جلب جميع البيع
        const bookingsWhere = {
          bookingDate: activeSession.sessionDate,
          status: { [Op.in]: ['confirmed', 'completed'] }
        };
        
        if (activeSession.branchId) {
          bookingsWhere.branchId = activeSession.branchId;
        }
        
        const allBookings = await Booking.findAll({
          where: bookingsWhere,
          transaction
        });
        
        // فلتر البيع حسب وقت الوردية
        const shiftBookings = allBookings.filter(b => {
          if (!b.bookingTime) return false;
          const bookingTime = b.bookingTime.substring(0, 8);
          
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
        
        // تحديث الجلسة
        const updateData = {
          totalSales,
          totalCash,
          totalCard,
          totalWallet,
          totalTransfer,
          totalDiscount,
          totalTax,
          transactionsCount,
          reportData,
          expectedClosingBalance: parseFloat(activeSession.openingBalance || 0) + parseFloat(totalCash || 0)
        };
        
        // إذا كانت الجلسة مغلقة تلقائياً وكانت البيع الجديدة بعد وقت الإغلاق، نعيد فتحها
        if (activeSession.status === 'auto_closed' && activeSession.endTime) {
          const endTime = new Date(activeSession.endTime);
          const bookingDateTime = new Date(`${bookingDate}T${time}`);
          
          // إذا كانت البيع بعد وقت الإغلاق، نعيد فتح الجلسة
          if (bookingDateTime > endTime) {
            updateData.status = 'open';
            updateData.endTime = null;
            errorLogger.logInfo("🔄 إعادة فتح جلسة وردية بسبب حجز جديد", {
              sessionId: activeSession.id
            });
          }
        }
        
        await activeSession.update(updateData, { transaction });
        
        errorLogger.logInfo("✅ تم تحديث جلسة الوردية", {
          sessionId: activeSession.id,
          status: activeSession.status,
          newTotalSales: totalSales,
          transactionsCount
        });
      }
    } catch (sessionError) {
      // لا نوقف العملية إذا فشل تحديث الجلسة
      errorLogger.logError(sessionError, {
        endpoint: 'POST /api/v1/bookings - تحديث جلسة الوردية',
        bookingId: booking.id
      });
      console.warn('⚠️ تحذير: لم يتم تحديث جلسة الوردية:', sessionError.message);
    }
    
    // تأكيد جميع التغييرات
    await transaction.commit();
    
    errorLogger.logSuccess("✅ تم إنشاء الحجز وخصم المخزون بنجاح", {
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      inventoryUpdates: inventoryUpdates
    });

    // جلب الحجز مع العلاقات
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'name', 'tableNumber', 'capacity']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحجز وخصم المخزون بنجاح',
      data: createdBooking,
      inventoryUpdates: inventoryUpdates
    });
  } catch (error) {
    // إلغاء جميع التغييرات في حالة حدوث خطأ
    await transaction.rollback();
    
    const errorId = errorLogger.logError(error, {
      endpoint: 'POST /api/v1/bookings',
      requestBody: req.body,
      headers: req.headers,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, {
      operation: 'create_booking',
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الحجز',
      errorId: errorId,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/bookings - جلب جميع البيع
router.get("/", async (req, res) => {
  try {
    errorLogger.logInfo("📋 جلب البيع", {
      query: req.query,
      headers: req.headers,
      ip: req.ip
    });

    const { branchId, date, status, limit = 50, offset = 0 } = req.query;
    
    const whereClause = {};
    if (branchId) whereClause.branchId = branchId;
    if (date) whereClause.bookingDate = date;
    if (status) whereClause.status = status;

    errorLogger.logInfo("🔍 شروط البحث", whereClause);

    // جلب البيع من قاعدة البيانات
    const result = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'name', 'tableNumber', 'capacity']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });

    errorLogger.logSuccess("✅ تم جلب البيع بنجاح", {
      count: result.count,
      returnedRows: result.rows.length
    });

    res.json({
      success: true,
      data: result.rows,
      total: result.count
    });
  } catch (error) {
    const errorId = errorLogger.logError(error, {
      endpoint: 'GET /api/v1/bookings',
      query: req.query,
      headers: req.headers,
      ip: req.ip
    }, {
      operation: 'fetch_bookings',
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيع',
      errorId: errorId,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
