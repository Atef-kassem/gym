const cron = require('node-cron');
const { ShiftSession, Shift } = require("../Model/index");
const { Op } = require("sequelize");
const errorLogger = require("../utils/errorLogger");

/**
 * خدمة الإغلاق التلقائي للورديات
 * تعمل كل دقيقة للتحقق من الورديات التي تحتاج إلى إغلاق تلقائي
 */

// دالة لحساب مبيعات الجلسة
async function calculateSessionSales(session) {
  try {
    const { QuickSale, Booking } = require("../Model/index");
    
    const quickSalesWhere = {
      saleDate: session.sessionDate,
      status: 'completed'
    };
    
    if (session.branchId) {
      quickSalesWhere.branchId = session.branchId;
    }
    
    const quickSales = await QuickSale.findAll({
      where: quickSalesWhere
    });
    
    const shiftQuickSales = quickSales.filter(sale => {
      if (!sale.saleTime) return false;
      const saleTime = sale.saleTime.substring(0, 8);
      
      if (session.expectedStartTime > session.expectedEndTime) {
        return saleTime >= session.expectedStartTime || saleTime <= session.expectedEndTime;
      } else {
        return saleTime >= session.expectedStartTime && saleTime <= session.expectedEndTime;
      }
    });
    
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
    
    const shiftBookings = bookings.filter(booking => {
      if (!booking.bookingTime) return false;
      const bookingTime = booking.bookingTime.substring(0, 8);
      
      if (session.expectedStartTime > session.expectedEndTime) {
        return bookingTime >= session.expectedStartTime || bookingTime <= session.expectedEndTime;
      } else {
        return bookingTime >= session.expectedStartTime && bookingTime <= session.expectedEndTime;
      }
    });
    
    const quickSalesTotal = shiftQuickSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);
    const bookingsTotal = shiftBookings.reduce((sum, booking) => sum + parseFloat(booking.finalAmount || 0), 0);
    const totalSales = quickSalesTotal + bookingsTotal;
    
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

// دالة للإغلاق التلقائي للورديات
async function autoCloseExpiredSessions() {
  try {
    const currentTime = new Date().toTimeString().split(' ')[0]; // HH:MM:SS
    const today = new Date().toISOString().split('T')[0];
    
    // جلب جميع الجلسات المفتوحة
    const openSessions = await ShiftSession.findAll({
      where: {
        status: 'open',
        sessionDate: today
      },
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['id', 'shiftName', 'startTime', 'endTime']
        }
      ]
    });
    
    for (const session of openSessions) {
      // التحقق من أن الوردية قد انتهت
      const shiftEndTime = session.expectedEndTime;
      
      // إذا كانت الوردية تعبر منتصف الليل، نتعامل معها بشكل خاص
      let shouldClose = false;
      
      if (session.expectedStartTime > session.expectedEndTime) {
        // الوردية تعبر منتصف الليل (مثل 22:00 إلى 06:00)
        // نغلقها إذا تجاوزنا وقت النهاية وكنا قبل وقت البداية
        if (currentTime > session.expectedEndTime && currentTime < session.expectedStartTime) {
          shouldClose = true;
        }
      } else {
        // وردية عادية
        if (currentTime > session.expectedEndTime) {
          shouldClose = true;
        }
      }
      
      if (shouldClose) {
        // إغلاق الوردية تلقائياً
        const salesData = await calculateSessionSales(session);
        const expectedClosingBalance = parseFloat(session.openingBalance) + parseFloat(salesData.totalCash);
        
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
          closingNotes: 'تم الإغلاق التلقائي - انتهى وقت الوردية',
          status: 'auto_closed',
          reportData: salesData.reportData
        });
        
        errorLogger.logSuccess(`تم إغلاق الوردية تلقائياً: ${session.shift.shiftName}`, {
          sessionId: session.id,
          shiftName: session.shift.shiftName,
          sessionDate: session.sessionDate,
          totalSales: salesData.totalSales
        });
        
        console.log(`✅ تم إغلاق الوردية تلقائياً: ${session.shift.shiftName} (جلسة #${session.id})`);
      }
    }
  } catch (error) {
    console.error('❌ خطأ في الإغلاق التلقائي للورديات:', error);
    errorLogger.logError(error, {
      service: 'shiftAutoCloseService'
    });
  }
}

// جدولة المهمة للتشغيل كل دقيقة
let cronJob = null;

function startAutoCloseService() {
  if (cronJob) {
    console.log('⚠️  خدمة الإغلاق التلقائي للورديات قيد التشغيل بالفعل');
    return;
  }
  
  // تشغيل المهمة كل دقيقة
  cronJob = cron.schedule('* * * * *', async () => {
    await autoCloseExpiredSessions();
  }, {
    scheduled: true,
    timezone: "Asia/Riyadh" // توقيت السعودية
  });
  
  console.log('✅ تم بدء خدمة الإغلاق التلقائي للورديات - تعمل كل دقيقة');
  
  // تشغيل مرة واحدة عند البداية
  autoCloseExpiredSessions();
}

function stopAutoCloseService() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('🛑 تم إيقاف خدمة الإغلاق التلقائي للورديات');
  }
}

module.exports = {
  startAutoCloseService,
  stopAutoCloseService,
  autoCloseExpiredSessions
};

