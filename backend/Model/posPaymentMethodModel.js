const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const POSPaymentMethod = sequelize.define('POSPaymentMethod', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'معرف الشركة'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'اسم طريقة الدفع'
  },
  nameEn: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'اسم طريقة الدفع بالإنجليزية'
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'رمز طريقة الدفع'
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'أيقونة طريقة الدفع'
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'حالة التفعيل'
  },
  fees: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'رسوم الدفع (نسبة مئوية)'
  },
  maxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 999999.99,
    comment: 'الحد الأقصى للمبلغ'
  },
  minAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.01,
    comment: 'الحد الأدنى للمبلغ'
  },
  supportsMixedPayment: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'يدعم الدفع المختلط'
  },
  requiresApproval: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'يتطلب موافقة'
  },
  approvalThreshold: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'حد الموافقة'
  },
  providerName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'اسم مقدم الخدمة'
  },
  apiKey: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'مفتاح API'
  },
  apiSecret: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'سر API'
  },
  isTestMode: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'وضع الاختبار'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'ترتيب العرض'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف طريقة الدفع'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'معرف المستخدم المنشئ'
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'معرف المستخدم المحدث'
  }
}, {
  tableName: 'POSPaymentMethods',
  timestamps: true,
  paranoid: true,
  comment: 'جدول طرق الدفع'
});

module.exports = POSPaymentMethod;
