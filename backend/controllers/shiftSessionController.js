const { ShiftSession, Shift, Branch, User, QuickSale, Booking } = require("../Model/index");
const { Op } = require("sequelize");
const errorLogger = require("../utils/errorLogger");
const sequelize = require("../Config/sequelize");

/**
 * Controller لإدارة جلسات الورديات
 */

// POST /api/shift-sessions/start - بدء جلسة وردية جديدة
exports.startShiftSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { shiftId, branchId, userId, openingBalance, notes } = req.body;
    
    if (!shiftId || !userId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'معرف الوردية والمستخدم مطلوبان'
      });
    }
    
    // جلب معلومات الوردية
    const shift = await Shift.findByPk(shiftId);
    if (!shift) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'الوردية غير موجودة'
      });
    }
    
    // التحقق من عدم وجود جلسة مفتوحة لنفس الوردية في نفس اليوم
    const today = new Date().toISOString().split('T')[0];
    const existingSession = await ShiftSession.findOne({
      where: {
        shiftId,
        sessionDate: today,
        status: 'open',
        ...(branchId && { branchId })
      },
      transaction
    });
    
    if (existingSession) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'يوجد جلسة مفتوحة بالفعل لهذه الوردية اليوم'
      });
    }
    
    // إنشاء جلسة جديدة
    const session = await ShiftSession.create({
      shiftId,
      branchId: branchId || null,
      userId,
      sessionDate: today,
      expectedStartTime: shift.startTime,
      expectedEndTime: shift.endTime,
      openingBalance: openingBalance || 0,
      notes: notes || null,
      status: 'open'
    }, { transaction });
    
    await transaction.commit();
    
    // جلب الجلسة مع العلاقات
    const createdSession = await ShiftSession.findByPk(session.id, {
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime', 'color']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'arabicName', 'email']
        }
      ]
    });
    
    errorLogger.logSuccess('تم بدء جلسة الوردية بنجاح', {
      sessionId: session.id,
      shiftId,
      userId
    });
    
    res.status(201).json({
      success: true,
      message: 'تم بدء الوردية بنجاح',
      data: createdSession
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in startShiftSession:', error);
    errorLogger.logError(error, {
      endpoint: 'POST /api/shift-sessions/start',
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في بدء جلسة الوردية',
      error: error.message
    });
  }
};

// GET /api/shift-sessions/current - جلب الجلسة الحالية المفتوحة
exports.getCurrentSession = async (req, res) => {
  try {
    const { branchId, userId } = req.query;
    const today = new Date().toISOString().split('T')[0];
    
    const whereClause = {
      sessionDate: today,
      status: 'open'
    };
    
    if (branchId) whereClause.branchId = branchId;
    if (userId) whereClause.userId = userId;
    
    const session = await ShiftSession.findOne({
      where: whereClause,
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime', 'color']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'arabicName', 'email']
        }
      ],
      order: [['startTime', 'DESC']]
    });
    
    // إذا كانت الجلسة مفتوحة، احسب المبيعات الحالية
    if (session && session.status === 'open') {
      const salesData = await calculateSessionSales(session);
      
      // تحديث بيانات الجلسة ديناميكياً (بدون حفظ في قاعدة البيانات)
      const updatedSession = {
        ...session.toJSON(),
        totalSales: salesData.totalSales,
        totalCash: salesData.totalCash,
        totalCard: salesData.totalCard,
        totalWallet: salesData.totalWallet,
        totalTransfer: salesData.totalTransfer,
        totalDiscount: salesData.totalDiscount,
        totalTax: salesData.totalTax,
        transactionsCount: salesData.transactionsCount,
        expectedClosingBalance: parseFloat(session.openingBalance) + parseFloat(salesData.totalCash)
      };
      
      return res.json({
        success: true,
        data: updatedSession
      });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    errorLogger.logError(error, {
      endpoint: 'GET /api/shift-sessions/current',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الجلسة الحالية'
    });
  }
};

// PUT /api/shift-sessions/:id/close - إغلاق جلسة وردية
exports.closeShiftSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { closingBalance, closedBy, closingNotes } = req.body;
    
    const session = await ShiftSession.findByPk(id, {
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime']
        }
      ],
      transaction
    });
    
    if (!session) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'الجلسة غير موجودة'
      });
    }
    
    if (session.status !== 'open') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'الجلسة مغلقة بالفعل'
      });
    }
    
    // حساب إجمالي المبيعات والإيرادات
    const salesData = await calculateSessionSales(session);
    
    // حساب الفرق النقدي
    const expectedClosingBalance = parseFloat(session.openingBalance) + parseFloat(salesData.totalCash);
    const actualClosingBalance = closingBalance || expectedClosingBalance;
    const cashDifference = actualClosingBalance - expectedClosingBalance;
    
    // تحديث الجلسة
    await session.update({
      endTime: new Date(),
      closingBalance: actualClosingBalance,
      expectedClosingBalance,
      cashDifference,
      totalSales: salesData.totalSales,
      totalCash: salesData.totalCash,
      totalCard: salesData.totalCard,
      totalWallet: salesData.totalWallet,
      totalTransfer: salesData.totalTransfer,
      totalDiscount: salesData.totalDiscount,
      totalTax: salesData.totalTax,
      transactionsCount: salesData.transactionsCount,
      closedBy: closedBy || null,
      closingNotes: closingNotes || null,
      status: 'closed',
      reportData: salesData.reportData
    }, { transaction });
    
    await transaction.commit();
    
    // جلب الجلسة المحدثة مع العلاقات
    const closedSession = await ShiftSession.findByPk(id, {
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime', 'color']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'arabicName', 'email']
        },
        {
          model: User,
          as: 'closingUser',
          attributes: ['id', 'arabicName', 'email']
        }
      ]
    });
    
    errorLogger.logSuccess('تم إغلاق جلسة الوردية بنجاح', {
      sessionId: id,
      totalSales: salesData.totalSales,
      cashDifference
    });
    
    res.json({
      success: true,
      message: 'تم إغلاق الوردية بنجاح',
      data: closedSession
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in closeShiftSession:', error);
    errorLogger.logError(error, {
      endpoint: `PUT /api/shift-sessions/${req.params.id}/close`,
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في إغلاق جلسة الوردية',
      error: error.message
    });
  }
};

// GET /api/shift-sessions/:id - جلب جلسة محددة
exports.getSessionById = async (req, res) => {
  try {
    const session = await ShiftSession.findByPk(req.params.id, {
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime', 'color']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'arabicName', 'email']
        },
        {
          model: User,
          as: 'closingUser',
          attributes: ['id', 'arabicName', 'email']
        }
      ]
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'الجلسة غير موجودة'
      });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error in getSessionById:', error);
    errorLogger.logError(error, {
      endpoint: `GET /api/shift-sessions/${req.params.id}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الجلسة'
    });
  }
};

// GET /api/shift-sessions - جلب جميع الجلسات مع فلترة
exports.getAllSessions = async (req, res) => {
  try {
    const { branchId, shiftId, status, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
    
    const whereClause = {};
    if (branchId) whereClause.branchId = branchId;
    if (shiftId) whereClause.shiftId = shiftId;
    if (status) whereClause.status = status;
    
    if (dateFrom && dateTo) {
      whereClause.sessionDate = {
        [Op.between]: [dateFrom, dateTo]
      };
    } else if (dateFrom) {
      whereClause.sessionDate = {
        [Op.gte]: dateFrom
      };
    } else if (dateTo) {
      whereClause.sessionDate = {
        [Op.lte]: dateTo
      };
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { rows: sessions, count } = await ShiftSession.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime', 'color']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'arabicName', 'email']
        },
        {
          model: User,
          as: 'closingUser',
          attributes: ['id', 'arabicName', 'email']
        }
      ],
      order: [['sessionDate', 'DESC'], ['startTime', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllSessions:', error);
    errorLogger.logError(error, {
      endpoint: 'GET /api/shift-sessions',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الجلسات'
    });
  }
};

// GET /api/shift-sessions/daily-report - جلب تقرير يومي لجميع الورديات
exports.getDailyReport = async (req, res) => {
  try {
    const { date, branchId } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const whereClause = {
      sessionDate: targetDate
    };
    
    if (branchId) whereClause.branchId = branchId;
    
    const sessions = await ShiftSession.findAll({
      where: whereClause,
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime', 'color']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'arabicName', 'email']
        }
      ],
      order: [['startTime', 'ASC']]
    });
    
    // تحديث بيانات الجلسات المفتوحة ديناميكياً
    const updatedSessions = await Promise.all(
      sessions.map(async (session) => {
        if (session.status === 'open') {
          // حساب المبيعات الحالية للجلسة المفتوحة
          const salesData = await calculateSessionSales(session);
          
          // إرجاع الجلسة مع البيانات المحدثة
          return {
            ...session.toJSON(),
            totalSales: salesData.totalSales,
            totalCash: salesData.totalCash,
            totalCard: salesData.totalCard,
            totalWallet: salesData.totalWallet,
            totalTransfer: salesData.totalTransfer,
            totalDiscount: salesData.totalDiscount,
            totalTax: salesData.totalTax,
            transactionsCount: salesData.transactionsCount,
            expectedClosingBalance: parseFloat(session.openingBalance) + parseFloat(salesData.totalCash)
          };
        }
        return session.toJSON();
      })
    );
    
    // حساب الإجماليات من الجلسات المحدثة
    const totalSales = updatedSessions.reduce((sum, s) => sum + parseFloat(s.totalSales || 0), 0);
    const totalCash = updatedSessions.reduce((sum, s) => sum + parseFloat(s.totalCash || 0), 0);
    const totalCard = updatedSessions.reduce((sum, s) => sum + parseFloat(s.totalCard || 0), 0);
    const totalWallet = updatedSessions.reduce((sum, s) => sum + parseFloat(s.totalWallet || 0), 0);
    const totalTransfer = updatedSessions.reduce((sum, s) => sum + parseFloat(s.totalTransfer || 0), 0);
    const totalDiscount = updatedSessions.reduce((sum, s) => sum + parseFloat(s.totalDiscount || 0), 0);
    const totalTax = updatedSessions.reduce((sum, s) => sum + parseFloat(s.totalTax || 0), 0);
    const totalTransactions = updatedSessions.reduce((sum, s) => sum + parseInt(s.transactionsCount || 0), 0);
    const totalCashDifference = updatedSessions.reduce((sum, s) => sum + parseFloat(s.cashDifference || 0), 0);
    
    res.json({
      success: true,
      data: {
        date: targetDate,
        summary: {
          totalSales,
          totalCash,
          totalCard,
          totalWallet,
          totalTransfer,
          totalDiscount,
          totalTax,
          totalTransactions,
          totalCashDifference,
          averageTransaction: totalTransactions > 0 ? (totalSales / totalTransactions) : 0,
          shiftsCount: updatedSessions.length,
          openShiftsCount: updatedSessions.filter(s => s.status === 'open').length,
          closedShiftsCount: updatedSessions.filter(s => s.status === 'closed').length
        },
        sessions: updatedSessions.map(s => ({
          id: s.id,
          shift: s.shift,
          branch: s.branch,
          user: s.user,
          startTime: s.startTime,
          endTime: s.endTime,
          status: s.status,
          openingBalance: s.openingBalance,
          closingBalance: s.closingBalance,
          expectedClosingBalance: s.expectedClosingBalance,
          cashDifference: s.cashDifference,
          totalSales: s.totalSales,
          totalCash: s.totalCash,
          totalCard: s.totalCard,
          totalWallet: s.totalWallet,
          totalTransfer: s.totalTransfer,
          totalDiscount: s.totalDiscount,
          totalTax: s.totalTax,
          transactionsCount: s.transactionsCount
        }))
      }
    });
  } catch (error) {
    console.error('Error in getDailyReport:', error);
    errorLogger.logError(error, {
      endpoint: 'GET /api/shift-sessions/daily-report',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب التقرير اليومي'
    });
  }
};

// دالة مساعدة لحساب مبيعات الجلسة
async function calculateSessionSales(session) {
  try {
    // جلب المبيعات السريعة في هذه الجلسة
    const quickSalesWhere = {
      saleDate: session.sessionDate,
      status: 'completed'
    };
    
    // إذا كانت الجلسة مرتبطة بفرع
    if (session.branchId) {
      quickSalesWhere.branchId = session.branchId;
    }
    
    const quickSales = await QuickSale.findAll({
      where: quickSalesWhere
    });
    
    // فلتر المبيعات حسب وقت الوردية
    const shiftQuickSales = quickSales.filter(sale => {
      if (!sale.saleTime) return false;
      const saleTime = sale.saleTime.substring(0, 8);
      
      // التعامل مع الورديات التي تعبر منتصف الليل
      if (session.expectedStartTime > session.expectedEndTime) {
        return saleTime >= session.expectedStartTime || saleTime <= session.expectedEndTime;
      } else {
        return saleTime >= session.expectedStartTime && saleTime <= session.expectedEndTime;
      }
    });
    
    // جلب البيع في هذه الجلسة
    const bookingsWhere = {
      bookingDate: session.sessionDate,
      status: {
        [Op.in]: ['confirmed', 'completed']
      }
    };
    
    if (session.branchId) {
      bookingsWhere.branchId = session.branchId;
    }
    
    const bookings = await Booking.findAll({
      where: bookingsWhere
    });
    
    // فلتر البيع حسب وقت الوردية
    const shiftBookings = bookings.filter(booking => {
      if (!booking.bookingTime) return false;
      const bookingTime = booking.bookingTime.substring(0, 8);
      
      if (session.expectedStartTime > session.expectedEndTime) {
        return bookingTime >= session.expectedStartTime || bookingTime <= session.expectedEndTime;
      } else {
        return bookingTime >= session.expectedStartTime && bookingTime <= session.expectedEndTime;
      }
    });
    
    // حساب الإجماليات
    const quickSalesTotal = shiftQuickSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);
    const bookingsTotal = shiftBookings.reduce((sum, booking) => sum + parseFloat(booking.finalAmount || 0), 0);
    const totalSales = quickSalesTotal + bookingsTotal;
    
    // حساب طرق الدفع
    const totalCash = shiftQuickSales
      .filter(s => s.paymentMethod === 'cash')
      .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
    
    const totalCard = shiftQuickSales
      .filter(s => s.paymentMethod === 'card')
      .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
    
    const totalWallet = shiftQuickSales
      .filter(s => s.paymentMethod === 'wallet')
      .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
    
    const totalTransfer = shiftQuickSales
      .filter(s => s.paymentMethod === 'transfer')
      .reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0);
    
    const totalDiscount = shiftQuickSales.reduce((sum, sale) => sum + parseFloat(sale.discountAmount || 0), 0);
    const totalTax = shiftQuickSales.reduce((sum, sale) => sum + parseFloat(sale.taxAmount || 0), 0);
    
    const transactionsCount = shiftQuickSales.length + shiftBookings.length;
    
    // بيانات التقرير التفصيلية
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
    
    return {
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
  } catch (error) {
    console.error('Error in calculateSessionSales:', error);
    return {
      totalSales: 0,
      totalCash: 0,
      totalCard: 0,
      totalWallet: 0,
      totalTransfer: 0,
      totalDiscount: 0,
      totalTax: 0,
      transactionsCount: 0,
      reportData: { quickSales: [], bookings: [] }
    };
  }
}

// PUT /api/shift-sessions/:id/auto-close - إغلاق تلقائي للجلسة
exports.autoCloseSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const session = await ShiftSession.findByPk(id, {
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime']
        }
      ],
      transaction
    });
    
    if (!session) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'الجلسة غير موجودة'
      });
    }
    
    if (session.status !== 'open') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'الجلسة مغلقة بالفعل'
      });
    }
    
    // حساب إجمالي المبيعات والإيرادات
    const salesData = await calculateSessionSales(session);
    
    // حساب المبلغ الختامي المتوقع
    const expectedClosingBalance = parseFloat(session.openingBalance) + parseFloat(salesData.totalCash);
    
    // تحديث الجلسة - الإغلاق التلقائي
    await session.update({
      endTime: new Date(),
      closingBalance: expectedClosingBalance,
      expectedClosingBalance,
      cashDifference: 0,
      totalSales: salesData.totalSales,
      totalCash: salesData.totalCash,
      totalCard: salesData.totalCard,
      totalWallet: salesData.totalWallet,
      totalTransfer: salesData.totalTransfer,
      totalDiscount: salesData.totalDiscount,
      totalTax: salesData.totalTax,
      transactionsCount: salesData.transactionsCount,
      closingNotes: 'تم الإغلاق التلقائي',
      status: 'auto_closed',
      reportData: salesData.reportData
    }, { transaction });
    
    await transaction.commit();
    
    errorLogger.logSuccess('تم الإغلاق التلقائي لجلسة الوردية', {
      sessionId: id,
      totalSales: salesData.totalSales
    });
    
    res.json({
      success: true,
      message: 'تم الإغلاق التلقائي للوردية',
      data: session
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in autoCloseSession:', error);
    errorLogger.logError(error, {
      endpoint: `PUT /api/shift-sessions/${req.params.id}/auto-close`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في الإغلاق التلقائي للجلسة',
      error: error.message
    });
  }
};

module.exports = exports;

