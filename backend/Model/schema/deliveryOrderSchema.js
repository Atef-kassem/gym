const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const DeliveryOrder = sequelize.define(
  "DELIVERY_ORDERS",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    orderNumber: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: true,
      comment: "رقم طلب التوصيل الفريد"
    },
    customerName: { 
      type: DataTypes.STRING(200), 
      allowNull: false,
      comment: "اسم العميل"
    },
    customerPhone: { 
      type: DataTypes.STRING(20), 
      allowNull: false,
      comment: "هاتف العميل"
    },
    customerAddress: { 
      type: DataTypes.TEXT, 
      allowNull: false,
      comment: "عنوان العميل"
    },
    deliveryAddress: { 
      type: DataTypes.TEXT, 
      allowNull: false,
      comment: "عنوان التوصيل"
    },
    deliveryLatitude: { 
      type: DataTypes.DECIMAL(10, 8), 
      allowNull: true,
      comment: "خط العرض للتوصيل"
    },
    deliveryLongitude: { 
      type: DataTypes.DECIMAL(11, 8), 
      allowNull: true,
      comment: "خط الطول للتوصيل"
    },
    orderDate: { 
      type: DataTypes.DATE, 
      allowNull: false,
      comment: "تاريخ الطلب"
    },
    scheduledDeliveryDate: { 
      type: DataTypes.DATE, 
      allowNull: true,
      comment: "تاريخ التوصيل المحدد"
    },
    actualDeliveryDate: { 
      type: DataTypes.DATE, 
      allowNull: true,
      comment: "تاريخ التوصيل الفعلي"
    },
    motorcycleId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف الدراجة النارية"
    },
    driverId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف السائق"
    },
    driverName: { 
      type: DataTypes.STRING(200), 
      allowNull: true,
      comment: "اسم السائق"
    },
    driverPhone: { 
      type: DataTypes.STRING(20), 
      allowNull: true,
      comment: "هاتف السائق"
    },
    orderValue: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      defaultValue: 0,
      comment: "قيمة الطلب"
    },
    deliveryFee: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "رسوم التوصيل"
    },
    totalAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      defaultValue: 0,
      comment: "المبلغ الإجمالي"
    },
    paymentMethod: { 
      type: DataTypes.ENUM("نقد", "بطاقة ائتمان", "تحويل بنكي", "محفظة إلكترونية", "عند التوصيل"), 
      allowNull: false,
      defaultValue: "نقد",
      comment: "طريقة الدفع"
    },
    paymentStatus: { 
      type: DataTypes.ENUM("غير مدفوع", "مدفوع", "مدفوع جزئياً", "مسترد"), 
      allowNull: false,
      defaultValue: "غير مدفوع",
      comment: "حالة الدفع"
    },
    status: { 
      type: DataTypes.ENUM("جديد", "قيد التحضير", "جاهز للتوصيل", "في الطريق", "تم التوصيل", "ملغي", "مؤجل"), 
      allowNull: false,
      defaultValue: "جديد",
      comment: "حالة الطلب"
    },
    priority: { 
      type: DataTypes.ENUM("عادي", "عاجل", "فائق العجلة"), 
      allowNull: false,
      defaultValue: "عادي",
      comment: "أولوية الطلب"
    },
    deliveryType: { 
      type: DataTypes.ENUM("عادي", "سريع", "مجدول", "مستعجل"), 
      allowNull: false,
      defaultValue: "عادي",
      comment: "نوع التوصيل"
    },
    estimatedDeliveryTime: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "الوقت المتوقع للتوصيل (دقيقة)"
    },
    actualDeliveryTime: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "الوقت الفعلي للتوصيل (دقيقة)"
    },
    distance: { 
      type: DataTypes.DECIMAL(8, 2), 
      allowNull: true,
      comment: "المسافة (كم)"
    },
    specialInstructions: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "تعليمات خاصة"
    },
    customerNotes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات العميل"
    },
    deliveryNotes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات التوصيل"
    },
    rating: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "تقييم الخدمة (1-5)"
    },
    feedback: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "تعليق العميل"
    },
    cancellationReason: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "سبب الإلغاء"
    },
    cancelledBy: { 
      type: DataTypes.ENUM("العميل", "النظام", "السائق", "الإدارة"), 
      allowNull: true,
      comment: "من ألغى الطلب"
    },
    cancellationDate: { 
      type: DataTypes.DATE, 
      allowNull: true,
      comment: "تاريخ الإلغاء"
    },
    branchId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف الفرع"
    },
    companyId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف الشركة"
    },
    createdBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "منشئ الطلب"
    },
    updatedBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "محدث الطلب"
    }
  },
  {
    tableName: "DELIVERY_ORDERS",
    timestamps: true,
    comment: "جدول طلبات التوصيل"
  }
);

module.exports = DeliveryOrder;
