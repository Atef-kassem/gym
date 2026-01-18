const sequelize = require('../Config/sequelize');

async function addBookingNumberColumn() {
  try {
    // إضافة العمود booking_number
    await sequelize.query(`
      ALTER TABLE BOOKINGS 
      ADD COLUMN booking_number VARCHAR(50) UNIQUE 
      AFTER id
      COMMENT 'رقم الحجز'
    `);
    console.log('✅ تم إضافة العمود booking_number بنجاح');

    // تحديث السجلات الموجودة بأرقام حجز
    await sequelize.query(`
      UPDATE BOOKINGS 
      SET booking_number = CONCAT('BK', LPAD(id, 10, '0'))
      WHERE booking_number IS NULL
    `);
    console.log('✅ تم تحديث أرقام الحجز للسجلات الموجودة');

    console.log('✅ اكتمل التحديث بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

addBookingNumberColumn();

