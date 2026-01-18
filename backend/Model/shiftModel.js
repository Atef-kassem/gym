const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

/**
 * نموذج الورديات
 * يحدد أوقات العمل والورديات المختلفة
 */
const Shift = sequelize.define("Shift", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shiftName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: "اسم الوردية"
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: "وقت بداية الوردية"
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: "وقت نهاية الوردية"
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Branches",
      key: "id",
    },
    comment: "معرف الفرع (اختياري)"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: "هل الوردية نشطة؟"
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "وصف الوردية"
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: '#3b82f6',
    comment: "لون الوردية في الجدول"
  }
}, {
  tableName: "Shifts",
  timestamps: true,
  underscored: false,
  comment: "جدول الورديات",
  indexes: [
    {
      unique: false,
      fields: ['branchId']
    },
    {
      unique: false,
      fields: ['isActive']
    },
    {
      unique: false,
      fields: ['startTime', 'endTime']
    }
  ]
});

module.exports = Shift;

