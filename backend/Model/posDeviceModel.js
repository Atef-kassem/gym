const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const POSDevice = sequelize.define('POSDevice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'اسم الجهاز'
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'الرقم التسلسلي للجهاز'
  },
  deviceType: {
    type: DataTypes.ENUM('desktop', 'tablet', 'mobile', 'terminal'),
    allowNull: false,
    defaultValue: 'desktop',
    comment: 'نوع الجهاز'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'معرف الفرع'
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'معرف المخزن المرتبط'
  },
  cashDrawerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'معرف الصندوق النقدي'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'حالة الجهاز'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'عنوان IP للجهاز'
  },
  printerType: {
    type: DataTypes.ENUM('thermal', 'receipt', 'laser', 'inkjet'),
    allowNull: false,
    defaultValue: 'thermal',
    comment: 'نوع الطابعة'
  },
  macAddress: {
    type: DataTypes.STRING(17),
    allowNull: true,
    comment: 'عنوان MAC للجهاز'
  },
  operatingSystem: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'نظام التشغيل'
  },
  softwareVersion: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'إصدار البرنامج'
  },
  lastSync: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'آخر مزامنة'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'ملاحظات إضافية'
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
  tableName: 'POSDevices',
  timestamps: true,
  paranoid: true,
  comment: 'جدول أجهزة نقاط البيع'
});

module.exports = POSDevice;
