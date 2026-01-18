const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const QuickSale = sequelize.define(
  "QuickSale",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    saleNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'sale_number',
      comment: "رقم البيع"
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'customer_id',
      comment: "معرف العميل"
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'customer_name',
      comment: "اسم العميل"
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'customer_phone',
      comment: "رقم الهاتف"
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'branch_id',
      comment: "معرف الفرع"
    },
    cashierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'cashier_id',
      comment: "معرف الكاشير"
    },
    saleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'sale_date',
      comment: "تاريخ البيع"
    },
    saleTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'sale_time',
      comment: "وقت البيع"
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "المنتجات المباعة"
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "المجموع الفرعي"
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'discount_amount',
      comment: "قيمة الخصم"
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'discount_percentage',
      comment: "نسبة الخصم"
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'tax_amount',
      comment: "قيمة الضريبة"
    },
    taxPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 15.00,
      field: 'tax_percentage',
      comment: "نسبة الضريبة"
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'total_amount',
      comment: "المبلغ الإجمالي"
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'wallet', 'transfer', 'mixed'),
      allowNull: false,
      defaultValue: 'cash',
      field: 'payment_method',
      comment: "طريقة الدفع"
    },
    paymentDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'payment_details',
      comment: "تفاصيل الدفع"
    },
    status: {
      type: DataTypes.ENUM('completed', 'refunded', 'cancelled'),
      allowNull: false,
      defaultValue: 'completed',
      comment: "حالة البيع"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ملاحظات"
    },
    loyaltyPointsEarned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'loyalty_points_earned',
      comment: "نقاط الولاء المكتسبة"
    },
    loyaltyPointsUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'loyalty_points_used',
      comment: "نقاط الولاء المستخدمة"
    },
    receiptPrinted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'receipt_printed',
      comment: "هل تم طباعة الايصال"
    }
  },
  {
    tableName: "quick_sales",
    timestamps: true,
    underscored: true,
    comment: "جدول البيع السريع"
  }
);

module.exports = QuickSale;
