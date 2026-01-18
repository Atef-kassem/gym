const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const GymClass = sequelize.define(
  "GymClass",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "اسم الحصة",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "وصف الحصة",
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
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
      comment: "معرف الفرع",
    },
    classDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "تاريخ الحصة",
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: "وقت البدء",
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: "وقت الانتهاء",
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 1,
      },
      comment: "الحد الأقصى لعدد الأعضاء",
    },
    currentEnrollments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: "عدد الأعضاء المسجلين حالياً",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
      comment: "سعر الحصة",
    },
    status: {
      type: DataTypes.ENUM("scheduled", "ongoing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "scheduled",
      comment: "حالة الحصة",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ملاحظات",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "حالة التفعيل",
    },
  },
  {
    tableName: "GymClasses",
    timestamps: true,
    indexes: [
      {
        fields: ["trainerId"],
      },
      {
        fields: ["branchId"],
      },
      {
        fields: ["classDate"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["classDate", "startTime"],
      },
    ],
  }
);

module.exports = GymClass;

