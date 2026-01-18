const { Shift } = require('./Model/index');

async function seedShifts() {
  try {
    // إضافة ورديات تجريبية
    const shifts = [
      {
        shiftName: 'الوردية الصباحية',
        startTime: '08:00:00',
        endTime: '16:00:00',
        description: 'وردية العمل الصباحية',
        color: '#10b981',
        isActive: true,
        branchId: null
      },
      {
        shiftName: 'الوردية المسائية',
        startTime: '16:00:00',
        endTime: '00:00:00',
        description: 'وردية العمل المسائية',
        color: '#f59e0b',
        isActive: true,
        branchId: null
      },
      {
        shiftName: 'الوردية الليلية',
        startTime: '00:00:00',
        endTime: '08:00:00',
        description: 'وردية العمل الليلية',
        color: '#8b5cf6',
        isActive: true,
        branchId: null
      }
    ];

    for (const shift of shifts) {
      await Shift.create(shift);
      console.log(`✅ تم إضافة ${shift.shiftName}`);
    }

    console.log('\n🎉 تم إضافة جميع الورديات بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedShifts();

