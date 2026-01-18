const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const MotorcycleMaintenance = sequelize.define(
  "MOTORCYCLE_MAINTENANCE",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    maintenanceCode: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: true,
      comment: "رمز الصيانة الفريد"
    },
    motorcycleId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف الدراجة النارية"
    },
    maintenanceType: { 
      type: DataTypes.ENUM("صيانة دورية", "صيانة طارئة", "إصلاح", "فحص", "تنظيف"), 
      allowNull: false,
      comment: "نوع الصيانة"
    },
    maintenanceDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: false,
      comment: "تاريخ الصيانة"
    },
    maintenanceTime: { 
      type: DataTypes.TIME, 
      allowNull: true,
      comment: "وقت الصيانة"
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "وصف الصيانة"
    },
    mileage: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "المسافة المقطوعة وقت الصيانة"
    },
    cost: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "تكلفة الصيانة"
    },
    laborCost: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "تكلفة العمالة"
    },
    partsCost: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "تكلفة القطع"
    },
    workshopName: { 
      type: DataTypes.STRING(200), 
      allowNull: true,
      comment: "اسم الورشة"
    },
    workshopContact: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "جهة اتصال الورشة"
    },
    technicianName: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "اسم الفني"
    },
    nextMaintenanceDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ الصيانة القادمة"
    },
    nextMaintenanceMileage: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "المسافة للصيانة القادمة"
    },
    status: { 
      type: DataTypes.ENUM("مجدولة", "قيد التنفيذ", "مكتملة", "ملغاة"), 
      allowNull: false,
      defaultValue: "مجدولة",
      comment: "حالة الصيانة"
    },
    completedDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ الإنجاز"
    },
    completedTime: { 
      type: DataTypes.TIME, 
      allowNull: true,
      comment: "وقت الإنجاز"
    },
    notes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات"
    },
    attachments: { 
      type: DataTypes.JSON, 
      allowNull: true,
      comment: "مرفقات الصيانة"
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
    tableName: "MOTORCYCLE_MAINTENANCE",
    timestamps: true,
    comment: "جدول صيانة الدراجات النارية"
  }
);

module.exports = MotorcycleMaintenance;
