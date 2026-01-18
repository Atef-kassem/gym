const repo = require("../Model/repository/revenueRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

class RevenueController {
  create = catchAsync(async (req, res, next) => {
    const revenueData = {
      ...req.body,
      createdBy: req.user?.id
    };

    const revenue = await repo.create(revenueData);
    
    res.status(201).json({
      status: "success",
      message: "تم إنشاء الإيراد بنجاح",
      data: revenue
    });
  });

  get = catchAsync(async (req, res, next) => {
    const revenue = await repo.findById(req.params.id);
    
    if (!revenue) {
      return next(new AppError("الإيراد غير موجود", 404));
    }

    res.status(200).json({
      status: "success",
      data: revenue
    });
  });

  list = catchAsync(async (req, res, next) => {
    const result = await repo.findAll(req.query);
    
    res.status(200).json({
      status: "success",
      results: result.revenues.length,
      data: {
        revenues: result.revenues,
        pagination: result.pagination
      }
    });
  });

  update = catchAsync(async (req, res, next) => {
    const updated = await repo.update(req.params.id, req.body);
    
    res.status(200).json({
      status: "success",
      message: "تم تحديث الإيراد بنجاح",
      data: updated
    });
  });

  delete = catchAsync(async (req, res, next) => {
    const result = await repo.delete(req.params.id);
    
    res.status(200).json({
      status: "success",
      message: result.message
    });
  });

  statistics = catchAsync(async (req, res, next) => {
    const stats = await repo.getStatistics(req.query);
    
    res.status(200).json({
      status: "success",
      data: stats
    });
  });

  topCustomers = catchAsync(async (req, res, next) => {
    const customers = await repo.getTopCustomers(req.query);
    
    res.status(200).json({
      status: "success",
      data: customers
    });
  });

  // مزامنة الإيرادات من إيصالات البيع والبيع
  syncRevenues = catchAsync(async (req, res, next) => {
    const { QuickSale, Booking } = require("../Model/index");
    const Revenue = require("../Model/schema/revenueSchema");
    const { Op } = require("sequelize");
    
    const { startDate, endDate, branchId } = req.query;
    
    if (!startDate || !endDate) {
      return next(new AppError("تاريخ البداية والنهاية مطلوبان", 400));
    }
    
    let syncedCount = 0;
    
    // مزامنة إيصالات البيع السريع
    const quickSalesWhere = {
      saleDate: {
        [Op.between]: [startDate, endDate]
      },
      status: 'completed'
    };
    
    if (branchId) {
      quickSalesWhere.branchId = branchId;
    }
    
    const quickSales = await QuickSale.findAll({
      where: quickSalesWhere
    });
    
    for (const sale of quickSales) {
      // التحقق من عدم وجود إيراد لهذه الايصال
      const existingRevenue = await Revenue.findOne({
        where: {
          invoiceNumber: sale.saleNumber,
          source: 'مبيعات منتجات'
        }
      });
      
      if (!existingRevenue) {
        await Revenue.create({
          revenueDate: sale.saleDate,
          source: 'مبيعات منتجات',
          subSource: 'مبيعات سريعة',
          amount: parseFloat(sale.totalAmount),
          paymentMethod: sale.paymentMethod === 'cash' ? 'نقدي' : 
                        sale.paymentMethod === 'card' ? 'بطاقة ائتمان' : 
                        sale.paymentMethod === 'wallet' ? 'محفظة إلكترونية' : 'تحويل بنكي',
          paymentStatus: 'مدفوع',
          description: `مبيعات سريعة - ${sale.saleNumber}`,
          customerName: sale.customerName || 'عميل نقدي',
          invoiceNumber: sale.saleNumber,
          branchId: sale.branchId,
          taxAmount: parseFloat(sale.taxAmount || 0),
          discountAmount: parseFloat(sale.discountAmount || 0),
          totalAmount: parseFloat(sale.totalAmount),
          netAmount: parseFloat(sale.totalAmount)
        });
        syncedCount++;
      }
    }
    
    // مزامنة البيع
    const bookingsWhere = {
      bookingDate: {
        [Op.between]: [startDate, endDate]
      },
      status: {
        [Op.in]: ['confirmed', 'completed']
      },
      paymentStatus: 'paid'
    };
    
    if (branchId) {
      bookingsWhere.branchId = branchId;
    }
    
    const bookings = await Booking.findAll({
      where: bookingsWhere
    });
    
    for (const booking of bookings) {
      const bookingNumber = booking.bookingNumber || `BK${booking.id.toString().padStart(10, '0')}`;
      
      // التحقق من عدم وجود إيراد لهذا الحجز
      const existingRevenue = await Revenue.findOne({
        where: {
          invoiceNumber: bookingNumber,
          source: 'مبيعات خدمات'
        }
      });
      
      if (!existingRevenue) {
        await Revenue.create({
          revenueDate: booking.bookingDate,
          source: 'مبيعات خدمات',
          subSource: 'حجوزات',
          amount: parseFloat(booking.finalAmount || booking.totalPrice || 0),
          paymentMethod: booking.paymentMethod === 'cash' ? 'نقدي' : 
                        booking.paymentMethod === 'card' ? 'بطاقة ائتمان' : 
                        booking.paymentMethod === 'wallet' ? 'محفظة إلكترونية' : 'تحويل بنكي',
          paymentStatus: 'مدفوع',
          description: `حجز - ${bookingNumber}`,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          invoiceNumber: bookingNumber,
          branchId: booking.branchId,
          taxAmount: 0,
          discountAmount: parseFloat(booking.discountAmount || 0),
          totalAmount: parseFloat(booking.finalAmount || booking.totalPrice || 0),
          netAmount: parseFloat(booking.finalAmount || booking.totalPrice || 0)
        });
        syncedCount++;
      }
    }
    
    res.status(200).json({
      status: "success",
      message: `تم مزامنة ${syncedCount} إيراد بنجاح`,
      data: {
        syncedCount,
        quickSalesCount: quickSales.length,
        bookingsCount: bookings.length
      }
    });
  });

  // حساب الإيرادات من المبيعات والبيع مباشرة
  getRevenuesFromSales = catchAsync(async (req, res, next) => {
    const { QuickSale, Booking } = require("../Model/index");
    const { Op } = require("sequelize");
    
    const { startDate, endDate, branchId } = req.query;
    
    if (!startDate || !endDate) {
      return next(new AppError("تاريخ البداية والنهاية مطلوبان", 400));
    }
    
    // جلب إيصالات البيع
    const quickSalesWhere = {
      saleDate: {
        [Op.between]: [startDate, endDate]
      },
      status: 'completed'
    };
    
    if (branchId) {
      quickSalesWhere.branchId = branchId;
    }
    
    const quickSales = await QuickSale.findAll({
      where: quickSalesWhere,
      attributes: ['id', 'saleNumber', 'saleDate', 'saleTime', 'customerName', 'totalAmount', 'paymentMethod', 'taxAmount', 'discountAmount', 'branchId']
    });
    
    // جلب البيع
    const bookingsWhere = {
      bookingDate: {
        [Op.between]: [startDate, endDate]
      },
      status: {
        [Op.in]: ['confirmed', 'completed']
      },
      paymentStatus: 'paid'
    };
    
    if (branchId) {
      bookingsWhere.branchId = branchId;
    }
    
    const bookings = await Booking.findAll({
      where: bookingsWhere,
      attributes: ['id', 'bookingNumber', 'bookingDate', 'bookingTime', 'customerName', 'finalAmount', 'totalPrice', 'paymentMethod', 'discountAmount', 'branchId']
    });
    
    // تحويل إلى صيغة إيرادات
    const revenuesFromSales = quickSales.map(sale => ({
      source: 'مبيعات منتجات',
      subSource: 'مبيعات سريعة',
      date: sale.saleDate,
      time: sale.saleTime,
      customerName: sale.customerName || 'عميل نقدي',
      amount: parseFloat(sale.totalAmount),
      paymentMethod: sale.paymentMethod,
      invoiceNumber: sale.saleNumber,
      taxAmount: parseFloat(sale.taxAmount || 0),
      discountAmount: parseFloat(sale.discountAmount || 0),
      branchId: sale.branchId,
      type: 'quick_sale',
      originalId: sale.id
    }));
    
    const revenuesFromBookings = bookings.map(booking => ({
      source: 'مبيعات خدمات',
      subSource: 'حجوزات',
      date: booking.bookingDate,
      time: booking.bookingTime,
      customerName: booking.customerName,
      amount: parseFloat(booking.finalAmount || booking.totalPrice || 0),
      paymentMethod: booking.paymentMethod,
      invoiceNumber: booking.bookingNumber || `BK${booking.id.toString().padStart(10, '0')}`,
      taxAmount: 0,
      discountAmount: parseFloat(booking.discountAmount || 0),
      branchId: booking.branchId,
      type: 'booking',
      originalId: booking.id
    }));
    
    const allRevenues = [...revenuesFromSales, ...revenuesFromBookings];
    
    // حساب الإحصائيات
    const totalAmount = allRevenues.reduce((sum, r) => sum + r.amount, 0);
    const totalTax = allRevenues.reduce((sum, r) => sum + r.taxAmount, 0);
    const totalDiscount = allRevenues.reduce((sum, r) => sum + r.discountAmount, 0);
    const netAmount = totalAmount - totalDiscount;
    
    // تصنيف حسب طريقة الدفع
    const byPaymentMethod = {
      cash: allRevenues.filter(r => r.paymentMethod === 'cash').reduce((sum, r) => sum + r.amount, 0),
      card: allRevenues.filter(r => r.paymentMethod === 'card').reduce((sum, r) => sum + r.amount, 0),
      wallet: allRevenues.filter(r => r.paymentMethod === 'wallet').reduce((sum, r) => sum + r.amount, 0),
      transfer: allRevenues.filter(r => r.paymentMethod === 'transfer').reduce((sum, r) => sum + r.amount, 0)
    };
    
    res.status(200).json({
      status: "success",
      data: {
        revenues: allRevenues,
        summary: {
          totalAmount,
          totalTax,
          totalDiscount,
          netAmount,
          count: allRevenues.length,
          quickSalesCount: revenuesFromSales.length,
          bookingsCount: revenuesFromBookings.length,
          byPaymentMethod
        }
      }
    });
  });
}

module.exports = new RevenueController();

