const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

/**
 * نموذج جلسات الورديات
 * يتتبع كل جلسة وردية من البداية حتى النهاية مع المبالغ والتقارير
 */
const ShiftSession = sequelize.define("ShiftSession", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shiftId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Shifts",
      key: "id",
    },
    comment: "معرف الوردية"
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Branches",
      key: "id",
    },
    comment: "معرف الفرع"
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    comment: "معرف المستخدم الذي بدأ الوردية"
  },
  sessionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: "تاريخ الجلسة"
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: "وقت بداية الجلسة الفعلي"
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "وقت نهاية الجلسة الفعلي"
  },
  expectedStartTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: "وقت بداية الوردية المتوقع"
  },
  expectedEndTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: "وقت نهاية الوردية المتوقع"
  },
  openingBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "المبلغ النقدي في بداية الوردية"
  },
  closingBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: "المبلغ النقدي في نهاية الوردية"
  },
  expectedClosingBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: "المبلغ المتوقع في نهاية الوردية (من المبيعات)"
  },
  cashDifference: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: "الفرق بين المبلغ الفعلي والمتوقع"
  },
  totalSales: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "إجمالي المبيعات"
  },
  totalCash: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "إجمالي النقدي"
  },
  totalCard: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "إجمالي البطاقة"
  },
  totalWallet: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "إجمالي المحفظة"
  },
  totalTransfer: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "إجمالي التحويل"
  },
  totalDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "إجمالي الخصومات"
  },
  totalTax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "إجمالي الضرائب"
  },
  transactionsCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: "عدد العمليات"
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'auto_closed'),
    allowNull: false,
    defaultValue: 'open',
    comment: "حالة الجلسة: مفتوحة، مغلقة، مغلقة تلقائياً"
  },
  closedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Users",
      key: "id",
    },
    comment: "المستخدم الذي أغلق الوردية"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات"
  },
  closingNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات الإغلاق"
  },
  reportData: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "بيانات التقرير الكاملة"
  }
}, {
  tableName: "ShiftSessions",
  timestamps: true,
  underscored: false,
  comment: "جدول جلسات الورديات",
  indexes: [
    {
      unique: false,
      fields: ['shiftId']
    },
    {
      unique: false,
      fields: ['branchId']
    },
    {
      unique: false,
      fields: ['userId']
    },
    {
      unique: false,
      fields: ['sessionDate']
    },
    {
      unique: false,
      fields: ['status']
    },
    {
      unique: false,
      fields: ['sessionDate', 'shiftId', 'branchId']
    }
  ]
});

module.exports = ShiftSession;

