const { Booking, Branch, Table } = require("./Model/index");
const sequelize = require("./Config/sequelize");

async function debugBooking() {
  try {
    console.log("=== تشخيص مشكلة البيع ===");
    
    // 1. فحص الاتصال بقاعدة البيانات
    console.log("1. فحص الاتصال بقاعدة البيانات...");
    await sequelize.authenticate();
    console.log("✅ الاتصال بقاعدة البيانات يعمل");
    
    // 2. فحص وجود الجداول
    console.log("\n2. فحص وجود الجداول...");
    
    // فحص جدول الفروع
    try {
      const branchesCount = await Branch.count();
      console.log(`✅ جدول الفروع موجود - عدد الفروع: ${branchesCount}`);
      
      if (branchesCount > 0) {
        const sampleBranch = await Branch.findOne();
        console.log(`   عينة فرع: ID=${sampleBranch.id}, Name=${sampleBranch.arabicName || sampleBranch.englishName}`);
      }
    } catch (error) {
      console.log(`❌ خطأ في جدول الفروع: ${error.message}`);
    }
    
    // فحص جدول الطاولات
    try {
      const tablesCount = await Table.count();
      console.log(`✅ جدول الطاولات موجود - عدد الطاولات: ${tablesCount}`);
      
      if (tablesCount > 0) {
        const sampleTable = await Table.findOne();
        console.log(`   عينة طاولة: ID=${sampleTable.id}, Name=${sampleTable.name}, BranchId=${sampleTable.branchId}`);
      }
    } catch (error) {
      console.log(`❌ خطأ في جدول الطاولات: ${error.message}`);
    }
    
    // فحص جدول البيع
    try {
      const bookingsCount = await Booking.count();
      console.log(`✅ جدول البيع موجود - عدد البيع: ${bookingsCount}`);
    } catch (error) {
      console.log(`❌ خطأ في جدول البيع: ${error.message}`);
    }
    
    // 3. فحص العلاقات
    console.log("\n3. فحص العلاقات...");
    
    try {
      // اختبار إنشاء حجز تجريبي
      console.log("اختبار إنشاء حجز تجريبي...");
      
      const testBranch = await Branch.findOne();
      const testTable = await Table.findOne();
      
      if (!testBranch) {
        console.log("❌ لا توجد فروع في قاعدة البيانات");
        return;
      }
      
      const testBooking = {
        bookingNumber: `TEST${Date.now()}`,
        customerName: "عميل تجريبي",
        customerPhone: "123456789",
        branchId: testBranch.id,
        tableId: testTable ? testTable.id : null,
        bookingDate: "2024-01-01",
        bookingTime: "10:00:00",
        status: 'pending',
        notes: 'حجز تجريبي للاختبار',
        totalPrice: 0,
        finalAmount: 0,
        paymentStatus: 'unpaid'
      };
      
      console.log("محاولة إنشاء حجز تجريبي...");
      const createdBooking = await Booking.create(testBooking);
      console.log(`✅ تم إنشاء الحجز التجريبي بنجاح - ID: ${createdBooking.id}`);
      
      // حذف الحجز التجريبي
      await Booking.destroy({ where: { id: createdBooking.id } });
      console.log("✅ تم حذف الحجز التجريبي");
      
    } catch (error) {
      console.log(`❌ خطأ في إنشاء الحجز التجريبي: ${error.message}`);
      console.log("تفاصيل الخطأ:", error);
    }
    
    console.log("\n=== انتهاء التشخيص ===");
    
  } catch (error) {
    console.log(`❌ خطأ عام في التشخيص: ${error.message}`);
    console.log("تفاصيل الخطأ:", error);
  } finally {
    await sequelize.close();
  }
}

// تشغيل التشخيص
debugBooking();
