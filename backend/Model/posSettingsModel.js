const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const POSSettings = sequelize.define('POSSettings', {
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
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'معرف الفرع (null للشركة)'
  },
  category: {
    type: DataTypes.ENUM('devices', 'payment', 'invoice', 'security', 'inventory', 'notifications', 'reports'),
    allowNull: false,
    comment: 'فئة الإعدادات'
  },
  settingKey: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'مفتاح الإعداد'
  },
  settingValue: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'قيمة الإعداد'
  },
  settingType: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
    allowNull: false,
    defaultValue: 'string',
    comment: 'نوع قيمة الإعداد'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'حالة الإعداد'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف الإعداد'
  },
  groupName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'اسم المجموعة'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'ترتيب الإعداد'
  },
  requiresRestart: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'يتطلب إعادة تشغيل'
  },
  isSystem: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'إعداد نظام (لا يمكن حذفه)'
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
  tableName: 'POSSettings',
  timestamps: true,
  paranoid: true,
  comment: 'جدول إعدادات نقاط البيع',
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'branchId', 'category', 'settingKey']
    }
  ]
});

module.exports = POSSettings;
