const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const DeliveryOrderItem = sequelize.define(
  "DELIVERY_ORDER_ITEMS",
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
    productId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف المنتج"
    },
    productName: { 
      type: DataTypes.STRING(200), 
      allowNull: false,
      comment: "اسم المنتج"
    },
    productCode: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "رمز المنتج"
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "وصف المنتج"
    },
    quantity: { 
      type: DataTypes.DECIMAL(10, 3), 
      allowNull: false,
      comment: "الكمية"
    },
    unit: { 
      type: DataTypes.STRING(50), 
      allowNull: true,
      comment: "الوحدة"
    },
    unitPrice: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      comment: "سعر الوحدة"
    },
    totalPrice: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      comment: "السعر الإجمالي"
    },
    discount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "الخصم"
    },
    discountPercentage: { 
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "نسبة الخصم"
    },
    tax: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "الضريبة"
    },
    taxPercentage: { 
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "نسبة الضريبة"
    },
    netAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      comment: "المبلغ الصافي"
    },
    notes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات"
    },
    isDelivered: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: false,
      comment: "تم التوصيل"
    },
    deliveredQuantity: { 
      type: DataTypes.DECIMAL(10, 3), 
      allowNull: true,
      defaultValue: 0,
      comment: "الكمية المسلمة"
    },
    returnedQuantity: { 
      type: DataTypes.DECIMAL(10, 3), 
      allowNull: true,
      defaultValue: 0,
      comment: "الكمية المرتجعة"
    },
    returnReason: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "سبب الإرجاع"
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
    tableName: "DELIVERY_ORDER_ITEMS",
    timestamps: true,
    comment: "جدول عناصر طلبات التوصيل"
  }
);

module.exports = DeliveryOrderItem;
