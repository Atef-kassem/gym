const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const QuickPurchaseOrder = sequelize.define(
  "quick_purchase_orders",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    orderNumber: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: false, // يمكن أن يكون نفس الرقم لأكثر من منتج في نفس الأمر
      comment: "رقم أمر الشراء السريع"
    },
    supplierId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف المورد"
    },
    productId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف المنتج (اختياري)"
    },
    productName: { 
      type: DataTypes.STRING, 
      allowNull: false,
      comment: "اسم المنتج"
    },
    quantity: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
      comment: "الكمية"
    },
    unit: { 
      type: DataTypes.STRING, 
      allowNull: true,
      defaultValue: "وحدة",
      comment: "وحدة القياس"
    },
    price: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "السعر"
    },
    totalAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false, 
      defaultValue: 0,
      comment: "المبلغ الإجمالي"
    },
    orderDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: false,
      comment: "تاريخ الطلب"
    },
    expectedDeliveryDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ التسليم المتوقع"
    },
    notes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات"
    },
    status: {
      type: DataTypes.ENUM("مسودة", "مرسل", "مؤكد", "مكتمل", "ملغي"),
      defaultValue: "مسودة",
      comment: "حالة الطلب"
    },
    branchId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف الفرع"
    },
    createdBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف المستخدم الذي أنشأ الطلب"
    },
  },
  {
    tableName: "QUICKPURCHASEORDERS",
    timestamps: true,
    hooks: {
      beforeCreate: (order) => {
        if (!order.orderNumber) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 5).toUpperCase();
          order.orderNumber = `QPO-${timestamp}-${random}`;
        }
        // حساب المبلغ الإجمالي
        if (order.quantity && order.price) {
          order.totalAmount = order.quantity * order.price;
        }
      },
      beforeUpdate: (order) => {
        // إعادة حساب المبلغ الإجمالي عند التحديث
        if (order.changed('quantity') || order.changed('price')) {
          order.totalAmount = (order.quantity || 0) * (order.price || 0);
        }
      }
    }
  }
);

// تعريف العلاقة
QuickPurchaseOrder.associate = (models) => {
  QuickPurchaseOrder.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier'
  });
};

module.exports = QuickPurchaseOrder;

