const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Motorcycle = sequelize.define(
  "MOTORCYCLES",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    motorcycleCode: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: true,
      comment: "رمز الدراجة النارية الفريد"
    },
    plateNumber: { 
      type: DataTypes.STRING(20), 
      allowNull: false, 
      unique: true,
      comment: "رقم اللوحة"
    },
    brand: { 
      type: DataTypes.STRING(100), 
      allowNull: false,
      comment: "الماركة"
    },
    model: { 
      type: DataTypes.STRING(100), 
      allowNull: false,
      comment: "الموديل"
    },
    year: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "سنة الصنع"
    },
    color: { 
      type: DataTypes.STRING(50), 
      allowNull: true,
      comment: "اللون"
    },
    engineNumber: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "رقم المحرك"
    },
    chassisNumber: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "رقم الهيكل"
    },
    capacity: { 
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: true,
      comment: "سعة المحرك (سي سي)"
    },
    fuelType: { 
      type: DataTypes.ENUM("بنزين", "ديزل", "كهربائي", "هجين"), 
      allowNull: false,
      defaultValue: "بنزين",
      comment: "نوع الوقود"
    },
    status: { 
      type: DataTypes.ENUM("متاح", "في الخدمة", "صيانة", "معطل", "محجوز"), 
      allowNull: false,
      defaultValue: "متاح",
      comment: "حالة الدراجة"
    },
    purchaseDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ الشراء"
    },
    purchasePrice: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      comment: "سعر الشراء"
    },
    currentValue: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      comment: "القيمة الحالية"
    },
    insuranceNumber: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "رقم التأمين"
    },
    insuranceExpiry: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "انتهاء التأمين"
    },
    registrationExpiry: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "انتهاء التسجيل"
    },
    lastMaintenanceDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ آخر صيانة"
    },
    nextMaintenanceDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ الصيانة القادمة"
    },
    mileage: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      defaultValue: 0,
      comment: "المسافة المقطوعة (كم)"
    },
    maxLoad: { 
      type: DataTypes.DECIMAL(8, 2), 
      allowNull: true,
      comment: "الحد الأقصى للحمل (كجم)"
    },
    fuelCapacity: { 
      type: DataTypes.DECIMAL(6, 2), 
      allowNull: true,
      comment: "سعة خزان الوقود (لتر)"
    },
    averageFuelConsumption: { 
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: true,
      comment: "متوسط استهلاك الوقود (لتر/100كم)"
    },
    driverId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف السائق المخصص"
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
    notes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات"
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: true,
      comment: "نشط"
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
    tableName: "MOTORCYCLES",
    timestamps: true,
    comment: "جدول إدارة الدراجات النارية للتوصيل"
  }
);

module.exports = Motorcycle;
