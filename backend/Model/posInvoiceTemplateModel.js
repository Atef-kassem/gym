const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const POSInvoiceTemplate = sequelize.define('POSInvoiceTemplate', {
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
    comment: 'اسم القالب'
  },
  type: {
    type: DataTypes.ENUM('simple', 'detailed', 'thermal', 'electronic'),
    allowNull: false,
    defaultValue: 'simple',
    comment: 'نوع القالب'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'هل هو افتراضي'
  },
  paperSize: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'A4',
    comment: 'حجم الورق'
  },
  includeHeader: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'تضمين ج.م الصفحة'
  },
  includeLogo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'تضمين الشعار'
  },
  includeFooter: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'تضمين تذييل الصفحة'
  },
  includeQR: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'تضمين رمز QR'
  },
  includeSignature: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'تضمين التوقيع'
  },
  headerText: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'نص ج.م الصفحة'
  },
  footerText: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'نص تذييل الصفحة'
  },
  cssStyles: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'أنماط CSS مخصصة'
  },
  layoutConfig: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'تكوين التخطيط'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'حالة القالب'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'ترتيب العرض'
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
  tableName: 'POSInvoiceTemplates',
  timestamps: true,
  paranoid: true,
  comment: 'جدول قوالب الإيصالات'
});

module.exports = POSInvoiceTemplate;
