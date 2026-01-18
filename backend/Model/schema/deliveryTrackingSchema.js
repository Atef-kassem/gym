const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const DeliveryTracking = sequelize.define(
  "DELIVERY_TRACKING",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    deliveryOrderId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف طلب التوصيل"
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
    status: { 
      type: DataTypes.ENUM("جاهز للانطلاق", "في الطريق", "وصل للموقع", "جاري التوصيل", "تم التوصيل", "فشل التوصيل"), 
      allowNull: false,
      comment: "حالة التتبع"
    },
    latitude: { 
      type: DataTypes.DECIMAL(10, 8), 
      allowNull: true,
      comment: "خط العرض"
    },
    longitude: { 
      type: DataTypes.DECIMAL(11, 8), 
      allowNull: true,
      comment: "خط الطول"
    },
    address: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "العنوان"
    },
    speed: { 
      type: DataTypes.DECIMAL(6, 2), 
      allowNull: true,
      comment: "السرعة (كم/ساعة)"
    },
    direction: { 
      type: DataTypes.DECIMAL(6, 2), 
      allowNull: true,
      comment: "الاتجاه (درجة)"
    },
    altitude: { 
      type: DataTypes.DECIMAL(8, 2), 
      allowNull: true,
      comment: "الارتفاع (متر)"
    },
    accuracy: { 
      type: DataTypes.DECIMAL(8, 2), 
      allowNull: true,
      comment: "دقة الموقع (متر)"
    },
    batteryLevel: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "مستوى البطارية (%)"
    },
    signalStrength: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "قوة الإشارة (%)"
    },
    timestamp: { 
      type: DataTypes.DATE, 
      allowNull: false,
      comment: "وقت التتبع"
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
    branchId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف الفرع"
    },
    companyId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف الشركة"
    }
  },
  {
    tableName: "DELIVERY_TRACKING",
    timestamps: true,
    comment: "جدول تتبع التوصيل"
  }
);

module.exports = DeliveryTracking;
