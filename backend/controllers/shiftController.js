const { Shift, Branch, QuickSale, Booking, ShiftSession } = require("../Model/index");
const { Op } = require("sequelize");
const errorLogger = require("../utils/errorLogger");

/**
 * Controller لإدارة الورديات
 */

// GET /api/shifts - جلب جميع الورديات
exports.getAllShifts = async (req, res) => {
  try {
    const { branchId, isActive } = req.query;
    
    const whereClause = {};
    if (branchId) whereClause.branchId = branchId;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    
    const shifts = await Shift.findAll({
      where: whereClause,
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName'],
          required: false
        }
      ],
      order: [['startTime', 'ASC']]
    });
    
    res.json({
      success: true,
      data: shifts
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/shifts'
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الورديات'
    });
  }
};

// GET /api/shifts/:id - جلب وردية محددة
exports.getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'الوردية غير موجودة'
      });
    }
    
    res.json({
      success: true,
      data: shift
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `GET /api/shifts/${req.params.id}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الوردية'
    });
  }
};

// POST /api/shifts - إنشاء وردية جديدة
exports.createShift = async (req, res) => {
  try {
    const { shiftName, startTime, endTime, branchId, description, color } = req.body;
    
    if (!shiftName || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'اسم الوردية ووقت البداية والنهاية مطلوبة'
      });
    }
    
    // التحقق من عدم تداخل الأوقات
    const overlappingShift = await Shift.findOne({
      where: {
        branchId: branchId || null,
        isActive: true,
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime]
            }
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime]
            }
          }
        ]
      }
    });
    
    if (overlappingShift) {
      return res.status(400).json({
        success: false,
        message: 'يوجد تداخل مع وردية أخرى في نفس الوقت'
      });
    }
    
    const shift = await Shift.create({
      shiftName,
      startTime,
      endTime,
      branchId: branchId || null,
      description: description || null,
      color: color || '#3b82f6',
      isActive: true
    });
    
    const createdShift = await Shift.findByPk(shift.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });
    
    errorLogger.logSuccess('تم إنشاء الوردية بنجاح', {
      shiftId: shift.id,
      shiftName
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء الوردية بنجاح',
      data: createdShift
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'POST /api/shifts',
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الوردية'
    });
  }
};

// PUT /api/shifts/:id - تحديث وردية
exports.updateShift = async (req, res) => {
  try {
    const { shiftName, startTime, endTime, branchId, description, color, isActive } = req.body;
    
    const shift = await Shift.findByPk(req.params.id);
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'الوردية غير موجودة'
      });
    }
    
    await shift.update({
      shiftName: shiftName || shift.shiftName,
      startTime: startTime || shift.startTime,
      endTime: endTime || shift.endTime,
      branchId: branchId !== undefined ? branchId : shift.branchId,
      description: description !== undefined ? description : shift.description,
      color: color || shift.color,
      isActive: isActive !== undefined ? isActive : shift.isActive
    });
    
    const updatedShift = await Shift.findByPk(req.params.id, {
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
      message: 'تم تحديث الوردية بنجاح',
      data: updatedShift
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `PUT /api/shifts/${req.params.id}`,
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الوردية'
    });
  }
};

// DELETE /api/shifts/:id - حذف وردية
exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'الوردية غير موجودة'
      });
    }
    
    await shift.destroy();
    
    res.json({
      success: true,
      message: 'تم حذف الوردية بنجاح'
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `DELETE /api/shifts/${req.params.id}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الوردية'
    });
  }
};

// GET /api/shifts/:id/revenue - جلب إيرادات وردية محددة
exports.getShiftRevenue = async (req, res) => {
  try {
    const { date } = req.query; // التاريخ المطلوب
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'التاريخ مطلوب'
      });
    }
    
    const shift = await Shift.findByPk(req.params.id);
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'الوردية غير موجودة'
      });
    }
    
    // جلب المبيعات السريعة في هذه الوردية (البحث المباشر من QuickSale)
    // نفلتر فقط المبيعات التي تقع ضمن وقت الوردية
    const quickSalesWhere = {
      saleDate: date,
      status: 'completed'
    };
    
    // جلب جميع المبيعات في هذا التاريخ أولاً
    const allQuickSales = await QuickSale.findAll({
      where: quickSalesWhere,
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ],
      order: [['saleTime', 'DESC']]
    });
    
    // فلتر المبيعات حسب وقت الوردية فقط
    const quickSales = allQuickSales.filter(sale => {
      if (!sale.saleTime) return false;
      const saleTime = sale.saleTime.substring(0, 8); // HH:MM:SS
      
      // التعامل مع الورديات التي تعبر منتصف الليل (مثل 15:00 إلى 00:00)
      if (shift.startTime > shift.endTime) {
        // الوردية تعبر منتصف الليل: من startTime حتى منتصف الليل أو من منتصف الليل حتى endTime
        return saleTime >= shift.startTime || saleTime <= shift.endTime;
      } else {
        // وردية عادية: من startTime حتى endTime
        return saleTime >= shift.startTime && saleTime <= shift.endTime;
      }
    });
    
    // جلب البيع في هذه الوردية
    // نفلتر فقط البيع التي تقع ضمن وقت الوردية
    const bookingsWhere = {
      bookingDate: date,
      status: {
        [Op.in]: ['confirmed', 'completed']
      }
    };
    
    // جلب جميع البيع في هذا التاريخ أولاً
    const allBookings = await Booking.findAll({
      attributes: [
        'id',
        'customerName',
        'customerPhone',
        'customerEmail',
        'branchId',
        'tableId',
        'bookingDate',
        'bookingTime',
        'status',
        'totalPrice',
        'finalAmount',
        'paymentStatus',
        'notes',
        'specialRequests'
      ],
      where: bookingsWhere,
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ],
      order: [['bookingTime', 'DESC']]
    });
    
    // فلتر البيع حسب وقت الوردية فقط
    const bookings = allBookings.filter(booking => {
      if (!booking.bookingTime) return false;
      const bookingTime = booking.bookingTime.substring(0, 8); // HH:MM:SS
      
      // التعامل مع الورديات التي تعبر منتصف الليل
      if (shift.startTime > shift.endTime) {
        return bookingTime >= shift.startTime || bookingTime <= shift.endTime;
      } else {
        return bookingTime >= shift.startTime && bookingTime <= shift.endTime;
      }
    });
    
    // حساب الإحصائيات
    const quickSalesTotal = quickSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);
    const bookingsTotal = bookings.reduce((sum, booking) => sum + parseFloat(booking.finalAmount || 0), 0);
    const totalRevenue = quickSalesTotal + bookingsTotal;
    
    const quickSalesCount = quickSales.length;
    const bookingsCount = bookings.length;
    const totalTransactions = quickSalesCount + bookingsCount;
    
    // حساب الخصومات والضرائب
    const totalDiscount = quickSales.reduce((sum, sale) => sum + parseFloat(sale.discountAmount || 0), 0);
    const totalTax = quickSales.reduce((sum, sale) => sum + parseFloat(sale.taxAmount || 0), 0);
    
    // تحليل طرق الدفع (عدد العمليات)
    const paymentMethods = {
      cash: quickSales.filter(s => s.paymentMethod === 'cash').length,
      card: quickSales.filter(s => s.paymentMethod === 'card').length,
      wallet: quickSales.filter(s => s.paymentMethod === 'wallet').length,
      transfer: quickSales.filter(s => s.paymentMethod === 'transfer').length,
    };
    
    return res.json({
      success: true,
      data: {
        shift: {
          id: shift.id,
          name: shift.shiftName,
          startTime: shift.startTime,
          endTime: shift.endTime,
          date: date
        },
        summary: {
          totalRevenue,
          quickSalesTotal,
          bookingsTotal,
          totalTransactions,
          quickSalesCount,
          bookingsCount,
          totalDiscount,
          totalTax,
          averageTransaction: totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0
        },
        paymentMethods,
        quickSales: quickSales.map(sale => ({
          id: sale.id,
          saleNumber: sale.saleNumber,
          time: sale.saleTime,
          customerName: sale.customerName,
          totalAmount: parseFloat(sale.totalAmount || 0),
          paymentMethod: sale.paymentMethod,
          items: sale.items
        })),
        bookings: bookings.map(booking => ({
          id: booking.id,
          bookingNumber: booking.bookingNumber || `BK${booking.id.toString().padStart(10, '0')}`,
          time: booking.bookingTime,
          customerName: booking.customerName,
          totalAmount: parseFloat(booking.finalAmount || 0),
          status: booking.status
        }))
      }
    });
  } catch (error) {
    console.error('Error in getShiftRevenue:', error);
    errorLogger.logError(error, {
      endpoint: `GET /api/shifts/${req.params.id}/revenue`,
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إيرادات الوردية',
      error: error.message
    });
  }
};

// GET /api/shifts/current - جلب الوردية الحالية
exports.getCurrentShift = async (req, res) => {
  try {
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    const shift = await Shift.findOne({
      where: {
        isActive: true,
        startTime: {
          [Op.lte]: currentTime
        },
        endTime: {
          [Op.gte]: currentTime
        }
      },
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
      data: shift
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/shifts/current'
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الوردية الحالية'
    });
  }
};

// GET /api/shifts/revenue - جلب إيرادات جميع الورديات
exports.getAllShiftsRevenue = async (req, res) => {
  try {
    const { date, branchId } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // جلب جميع الورديات النشطة
    const whereClause = { isActive: true };
    if (branchId) whereClause.branchId = branchId;
    
    const shifts = await Shift.findAll({
      where: whereClause,
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName'],
          required: false
        }
      ],
      order: [['startTime', 'ASC']]
    });
    
    // حساب إيرادات كل وردية
    const shiftsRevenue = await Promise.all(
      shifts.map(async (shift) => {
        // جلب المبيعات السريعة في هذه الوردية
        const quickSalesWhere = {
          saleDate: targetDate,
          status: 'completed'
        };
        
        // إذا كانت الوردية مرتبطة بفرع، فلتر حسب الفرع
        if (shift.branchId) {
          quickSalesWhere.branchId = shift.branchId;
        }
        
        const quickSales = await QuickSale.findAll({
          where: quickSalesWhere
        });
        
        // فلتر المبيعات حسب وقت الوردية
        const shiftQuickSales = quickSales.filter(sale => {
          if (!sale.saleTime) return false;
          const saleTime = sale.saleTime.substring(0, 8); // HH:MM:SS
          
          // التعامل مع الورديات التي تعبر منتصف الليل
          if (shift.startTime > shift.endTime) {
            return saleTime >= shift.startTime || saleTime <= shift.endTime;
          } else {
            return saleTime >= shift.startTime && saleTime <= shift.endTime;
          }
        });
        
        // جلب البيع في هذه الوردية
        const bookingsWhere = {
          bookingDate: targetDate,
          status: {
            [Op.in]: ['confirmed', 'completed']
          }
        };
        
        if (shift.branchId) {
          bookingsWhere.branchId = shift.branchId;
        }
        
        const bookings = await Booking.findAll({
          where: bookingsWhere
        });
        
        // فلتر البيع حسب وقت الوردية
        const shiftBookings = bookings.filter(booking => {
          if (!booking.bookingTime) return false;
          const bookingTime = booking.bookingTime.substring(0, 8);
          
          // التعامل مع الورديات التي تعبر منتصف الليل
          if (shift.startTime > shift.endTime) {
            return bookingTime >= shift.startTime || bookingTime <= shift.endTime;
          } else {
            return bookingTime >= shift.startTime && bookingTime <= shift.endTime;
          }
        });
        
        // حساب الإحصائيات
        const quickSalesTotal = shiftQuickSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);
        const bookingsTotal = shiftBookings.reduce((sum, booking) => sum + parseFloat(booking.finalAmount || 0), 0);
        const totalRevenue = quickSalesTotal + bookingsTotal;
        
        const quickSalesCount = shiftQuickSales.length;
        const bookingsCount = shiftBookings.length;
        const totalTransactions = quickSalesCount + bookingsCount;
        
        // حساب الخصومات والضرائب
        const totalDiscount = shiftQuickSales.reduce((sum, sale) => sum + parseFloat(sale.discountAmount || 0), 0);
        const totalTax = shiftQuickSales.reduce((sum, sale) => sum + parseFloat(sale.taxAmount || 0), 0);
        
        return {
          shift: {
            id: shift.id,
            name: shift.shiftName,
            startTime: shift.startTime,
            endTime: shift.endTime,
            color: shift.color,
            branch: shift.branch ? {
              id: shift.branch.id,
              name: shift.branch.arabicName || shift.branch.englishName
            } : null
          },
          revenue: {
            totalRevenue,
            quickSalesTotal,
            bookingsTotal,
            totalTransactions,
            quickSalesCount,
            bookingsCount,
            totalDiscount,
            totalTax,
            averageTransaction: totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0
          }
        };
      })
    );
    
    // حساب الإجمالي الكلي
    const totalRevenue = shiftsRevenue.reduce((sum, shift) => sum + shift.revenue.totalRevenue, 0);
    const totalTransactions = shiftsRevenue.reduce((sum, shift) => sum + shift.revenue.totalTransactions, 0);
    const totalDiscount = shiftsRevenue.reduce((sum, shift) => sum + shift.revenue.totalDiscount, 0);
    const totalTax = shiftsRevenue.reduce((sum, shift) => sum + shift.revenue.totalTax, 0);
    
    res.json({
      success: true,
      data: {
        date: targetDate,
        summary: {
          totalRevenue,
          totalTransactions,
          totalDiscount,
          totalTax,
          averageTransaction: totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0
        },
        shifts: shiftsRevenue
      }
    });
  } catch (error) {
    console.error('Error in getAllShiftsRevenue:', error);
    errorLogger.logError(error, {
      endpoint: 'GET /api/shifts/revenue',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إيرادات الورديات',
      error: error.message
    });
  }
};

