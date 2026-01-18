const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingNumber: {
      type: DataTypes.STRING(50),
      allowNull: true, // تغيير إلى اختياري ليتم توليده تلقائياً
      unique: true,
      field: 'booking_number',
      comment: "رقم الحجز"
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'customer_name',
      comment: "اسم العميل"
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'customer_phone',
      comment: "رقم هاتف العميل"
    },
    customerEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'customer_email',
      comment: "بريد العميل الإلكتروني"
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'branch_id', // تحديد اسم العمود في قاعدة البيانات
      comment: "معرف الفرع"
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'table_id', // تحديد اسم العمود في قاعدة البيانات
      comment: "معرف الطاولة"
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'booking_date',
      comment: "تاريخ الحجز"
    },
    bookingTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'booking_time',
      comment: "وقت الحجز"
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'),
      allowNull: false,
      defaultValue: 'pending',
      comment: "حالة الحجز"
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'total_price',
      comment: "السعر الإجمالي"
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'final_amount',
      comment: "المبلغ النهائي"
    },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'),
      allowNull: false,
      defaultValue: 'unpaid',
      field: 'payment_status',
      comment: "حالة الدفع"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ملاحظات"
    },
    specialRequests: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'special_requests',
      comment: "طلبات خاصة"
    },
  },
  {
    tableName: "BOOKINGS",
    timestamps: true,
    underscored: true,
    comment: "جدول إدارة البيع",
    hooks: {
      beforeCreate: async (booking) => {
        // توليد رقم حجز تلقائي إذا لم يكن موجوداً
        if (!booking.bookingNumber) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          booking.bookingNumber = `BK${timestamp}${random}`;
        }
      }
    }
  }
);

// إضافة العلاقات
Booking.associate = function(models) {
  // علاقة مع Branch
  Booking.belongsTo(models.Branch, {
    foreignKey: 'branchId',
    as: 'branch'
  });
  
  // علاقة مع Table
  Booking.belongsTo(models.Table, {
    foreignKey: 'tableId',
    as: 'table'
  });
};

module.exports = Booking;
