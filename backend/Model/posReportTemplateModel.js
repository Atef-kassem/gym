const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const POSReportTemplate = sequelize.define('POSReportTemplate', {
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
    comment: 'اسم قالب التقرير'
  },
  type: {
    type: DataTypes.ENUM('sales', 'inventory', 'financial', 'operational', 'customer', 'product', 'employee'),
    allowNull: false,
    comment: 'نوع التقرير'
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'on-demand'),
    allowNull: false,
    comment: 'تكرار التقرير'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'حالة القالب'
  },
  autoGenerate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'إنشاء تلقائي'
  },
  recipients: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    comment: 'المستلمون'
  },
  format: {
    type: DataTypes.ENUM('pdf', 'excel', 'csv', 'html'),
    allowNull: false,
    defaultValue: 'pdf',
    comment: 'تنسيق التقرير'
  },
  schedule: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'جدولة التقرير'
  },
  lastGenerated: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'آخر إنشاء'
  },
  nextGeneration: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'الإنشاء القادم'
  },
  parameters: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'معاملات التقرير'
  },
  filters: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'مرشحات التقرير'
  },
  columns: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'أعمدة التقرير'
  },
  sorting: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'ترتيب البيانات'
  },
  grouping: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'تجميع البيانات'
  },
  charts: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'الرسوم البيانية'
  },
  watermark: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'علامة مائية'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'كلمة مرور التقرير'
  },
  retentionDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 365,
    comment: 'فترة الاحتفاظ (أيام)'
  },
  maxFileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: 'الحد الأقصى لحجم الملف (ميجابايت)'
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
  tableName: 'POSReportTemplates',
  timestamps: true,
  paranoid: true,
  comment: 'جدول قوالب التقارير'
});

module.exports = POSReportTemplate;
