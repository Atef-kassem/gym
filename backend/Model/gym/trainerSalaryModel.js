const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const TrainerSalary = sequelize.define(
  "TrainerSalary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trainerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "AppTrainers",
        key: "id",
      },
      comment: "معرف المدرب",
    },
    baseSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "المرتب الأساسي",
    },
    classCommissionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
      comment: "نسبة العمولة من الحصص (%)",
    },
    subscriptionCommissionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
      comment: "نسبة العمولة من الاشتراكات (%)",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "حالة النشاط",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ملاحظات",
    },
    effectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "تاريخ بدء السريان",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "تاريخ الانتهاء (null يعني لا يوجد تاريخ انتهاء)",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "معرف المستخدم المنشئ",
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "معرف المستخدم المحدث",
    },
  },
  {
    tableName: "TrainerSalaries",
    timestamps: true,
    comment: "جدول أجور المدربين",
    indexes: [
      {
        fields: ["trainerId"],
      },
      {
        fields: ["isActive"],
      },
      {
        fields: ["effectiveDate"],
      },
    ],
  }
);

module.exports = TrainerSalary;

