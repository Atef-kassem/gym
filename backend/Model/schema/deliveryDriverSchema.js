const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const DeliveryDriver = sequelize.define(
  "DELIVERY_DRIVERS",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    driverCode: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: true,
      comment: "رمز السائق الفريد"
    },
    name: { 
      type: DataTypes.STRING(200), 
      allowNull: false,
      comment: "اسم السائق"
    },
    nameEn: { 
      type: DataTypes.STRING(200), 
      allowNull: true,
      comment: "اسم السائق بالإنجليزية"
    },
    phone: { 
      type: DataTypes.STRING(20), 
      allowNull: false,
      comment: "رقم الهاتف"
    },
    email: { 
      type: DataTypes.STRING(200), 
      allowNull: true,
      comment: "البريد الإلكتروني"
    },
    nationalId: { 
      type: DataTypes.STRING(20), 
      allowNull: true,
      comment: "رقم الهوية الوطنية"
    },
    licenseNumber: { 
      type: DataTypes.STRING(50), 
      allowNull: false,
      comment: "رقم رخصة القيادة"
    },
    licenseType: { 
      type: DataTypes.ENUM("دراجة نارية", "مشروب", "شاحنة صغيرة", "شاحنة كبيرة"), 
      allowNull: false,
      comment: "نوع الرخصة"
    },
    licenseExpiry: { 
      type: DataTypes.DATEONLY, 
      allowNull: false,
      comment: "انتهاء الرخصة"
    },
    dateOfBirth: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ الميلاد"
    },
    address: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "العنوان"
    },
    emergencyContact: { 
      type: DataTypes.STRING(200), 
      allowNull: true,
      comment: "جهة الاتصال في الطوارئ"
    },
    emergencyPhone: { 
      type: DataTypes.STRING(20), 
      allowNull: true,
      comment: "هاتف الطوارئ"
    },
    hireDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ التوظيف"
    },
    salary: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      comment: "الراتب"
    },
    commissionRate: { 
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "نسبة العمولة (%)"
    },
    status: { 
      type: DataTypes.ENUM("نشط", "غير نشط", "إجازة", "معلق", "مستقيل"), 
      allowNull: false,
      defaultValue: "نشط",
      comment: "حالة السائق"
    },
    isAvailable: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: true,
      comment: "متاح للتوصيل"
    },
    currentLocation: { 
      type: DataTypes.JSON, 
      allowNull: true,
      comment: "الموقع الحالي"
    },
    lastActiveTime: { 
      type: DataTypes.DATE, 
      allowNull: true,
      comment: "آخر وقت نشاط"
    },
    totalDeliveries: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      defaultValue: 0,
      comment: "إجمالي التوصيلات"
    },
    successfulDeliveries: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      defaultValue: 0,
      comment: "التوصيلات الناجحة"
    },
    failedDeliveries: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      defaultValue: 0,
      comment: "التوصيلات الفاشلة"
    },
    averageRating: { 
      type: DataTypes.DECIMAL(3, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "متوسط التقييم"
    },
    totalEarnings: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "إجمالي الأرباح"
    },
    notes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات"
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
      comment: "منشئ السجل"
    },
    updatedBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "محدث السجل"
    }
  },
  {
    tableName: "DELIVERY_DRIVERS",
    timestamps: true,
    comment: "جدول سائقي التوصيل"
  }
);

module.exports = DeliveryDriver;
