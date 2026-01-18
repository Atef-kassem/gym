const { Booking, Branch, Table, User } = require("../Model/index");
const errorLogger = require("../utils/errorLogger");
const { Op } = require("sequelize");

/**
 * Controller لإدارة البيع
 */

// POST /api/bookings - إنشاء حجز جديد
exports.createBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      branchId,
      tableId,
      shiftId,
      date,
      time,
      services,
      notes
    } = req.body;

    if (!customerName || !customerPhone || !branchId || !tableId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول المطلوبة يجب إدخالها'
      });
    }

    // حساب السعر الإجمالي من الخدمات
    let totalPrice = 0;
    if (services && services.length > 0) {
      totalPrice = services.reduce((sum, service) => {
        const price = typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0;
        return sum + price;
      }, 0);
    }

    // حساب الضريبة
    const taxRate = 0.15;
    const taxAmount = totalPrice * taxRate;
    const finalAmount = totalPrice + taxAmount;

    const booking = await Booking.create({
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      branchId: parseInt(branchId),
      tableId: parseInt(tableId),
      shiftId: shiftId ? parseInt(shiftId) : null,
      bookingDate: date,
      bookingTime: time,
      status: 'confirmed',
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2)),
      paymentStatus: 'unpaid',
      notes: notes || null,
      specialRequests: services ? JSON.stringify(services) : null
    });

    errorLogger.logSuccess('تم إنشاء الحجز بنجاح', {
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerName: booking.customerName
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحجز بنجاح',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    errorLogger.logError(error, {
      endpoint: 'POST /api/bookings',
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الحجز',
      error: error.message
    });
  }
};

// GET /api/bookings - جلب جميع البيع
exports.getAllBookings = async (req, res) => {
  try {
    const { branchId, date, status, tableId } = req.query;

    const whereClause = {};
    if (branchId) whereClause.branchId = branchId;
    if (date) whereClause.bookingDate = date;
    if (status) whereClause.status = status;
    if (tableId) whereClause.tableId = tableId;

    const bookings = await Booking.findAll({
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
      order: [['bookingDate', 'DESC'], ['bookingTime', 'DESC']]
    });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/bookings'
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيع'
    });
  }
};

// GET /api/bookings/:id - جلب حجز محدد
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
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

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `GET /api/bookings/${req.params.id}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الحجز'
    });
  }
};

// PUT /api/bookings/:id - تحديث حجز
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }

    await booking.update(req.body);

    res.json({
      success: true,
      message: 'تم تحديث الحجز بنجاح',
      data: booking
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `PUT /api/bookings/${req.params.id}`,
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الحجز'
    });
  }
};

// DELETE /api/bookings/:id - حذف حجز
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }

    await booking.destroy();

    res.json({
      success: true,
      message: 'تم حذف الحجز بنجاح'
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `DELETE /api/bookings/${req.params.id}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الحجز'
    });
  }
};

// GET /api/bookings/time-slots - جلب الأوقات المتاحة
exports.getTimeSlots = async (req, res) => {
  try {
    const { branchId, date } = req.query;

    if (!branchId || !date) {
      return res.status(400).json({
        success: false,
        message: 'الفرع والتاريخ مطلوبان'
      });
    }

    // توليد أوقات افتراضية (من 8 صباحاً إلى 11 مساءً كل ساعة)
    const timeSlots = [];
    for (let hour = 8; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00:00`;
      timeSlots.push(time);
    }

    // جلب البيع الموجودة
    const existingBookings = await Booking.findAll({
      where: {
        branchId,
        bookingDate: date,
        status: {
          [Op.in]: ['pending', 'confirmed', 'in-progress']
        }
      },
      attributes: ['bookingTime']
    });

    const bookedTimes = existingBookings.map(b => b.bookingTime);
    const availableSlots = timeSlots.filter(slot => !bookedTimes.includes(slot));

    res.json({
      success: true,
      data: {
        allSlots: timeSlots,
        availableSlots,
        bookedSlots: bookedTimes
      }
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/bookings/time-slots',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأوقات المتاحة'
    });
  }
};

// GET /api/bookings/availability - التحقق من توفر وقت محدد
exports.checkAvailability = async (req, res) => {
  try {
    const { branchId, date, time } = req.query;

    if (!branchId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'جميع المعاملات مطلوبة'
      });
    }

    const existingBooking = await Booking.findOne({
      where: {
        branchId,
        bookingDate: date,
        bookingTime: time,
        status: {
          [Op.in]: ['pending', 'confirmed', 'in-progress']
        }
      }
    });

    res.json({
      success: true,
      data: {
        available: !existingBooking,
        message: existingBooking ? 'هذا الوقت محجوز' : 'هذا الوقت متاح'
      }
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/bookings/availability',
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في التحقق من التوفر'
    });
  }
};

module.exports = exports;

