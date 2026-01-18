const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const POSNotificationRule = sequelize.define('POSNotificationRule', {
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
    comment: 'اسم قاعدة الإشعار'
  },
  type: {
    type: DataTypes.ENUM('transaction', 'inventory', 'system', 'security', 'payment', 'user'),
    allowNull: false,
    comment: 'نوع الإشعار'
  },
  trigger: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'مشغل الإشعار'
  },
  threshold: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'حد التنبيه'
  },
  thresholdType: {
    type: DataTypes.ENUM('amount', 'quantity', 'count', 'percentage'),
    allowNull: true,
    comment: 'نوع الحد'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'حالة القاعدة'
  },
  channels: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: ['inapp'],
    comment: 'قنوات الإشعار'
  },
  recipients: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    comment: 'المستلمون'
  },
  messageTemplate: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'قالب الرسالة'
  },
  subjectTemplate: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'قالب الموضوع'
  },
  conditions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'شروط إضافية'
  },
  schedule: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'جدولة الإشعارات'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'normal',
    comment: 'أولوية الإشعار'
  },
  groupBy: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'تجميع الإشعارات'
  },
  cooldownMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'مهلة التبريد (دقائق)'
  },
  maxNotificationsPerHour: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: 'الحد الأقصى للإشعارات في الساعة'
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
  tableName: 'POSNotificationRules',
  timestamps: true,
  paranoid: true,
  comment: 'جدول قواعد الإشعارات'
});

module.exports = POSNotificationRule;
