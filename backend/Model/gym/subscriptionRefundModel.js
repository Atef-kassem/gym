const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const SubscriptionRefund = sequelize.define(
  "SubscriptionRefund",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "GymSubscriptions",
        key: "id",
      },
      comment: "الاشتراك المراد إيقافه",
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Members",
        key: "id",
      },
      comment: "معرف العضو",
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "اسم العميل",
    },
    subscriptionType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "نوع الاشتراك",
    },
    originalStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "تاريخ بداية الاشتراك الأصلي",
    },
    originalEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "تاريخ نهاية الاشتراك الأصلي",
    },
    stopDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "تاريخ إيقاف الاشتراك",
    },
    remainingDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "عدد الأيام المتبقية",
    },
    originalValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "القيمة الأصلية للاشتراك",
    },
    dailyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "السعر اليومي",
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "قيمة المردود",
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: "رقم الايصال",
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "معرف الايصال المرتبطة",
    },
    refundDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "تاريخ المردود",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "سبب الإيقاف",
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
      comment: "حالة المردود",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "المستخدم الذي أنشأ المردود",
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
      comment: "الفرع",
    },
  },
  {
    tableName: "SubscriptionRefunds",
    timestamps: true,
    indexes: [
      {
        fields: ["subscriptionId"],
      },
      {
        fields: ["memberId"],
      },
      {
        fields: ["refundDate"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["branchId"],
      },
      {
        unique: true,
        fields: ["invoiceNumber"],
      },
    ],
  }
);

module.exports = SubscriptionRefund;

