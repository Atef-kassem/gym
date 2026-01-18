const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const SubscriptionTransfer = sequelize.define(
  "SubscriptionTransfer",
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
      comment: "الاشتراك الأصلي",
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
    fromSubscriptionType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "نوع الاشتراك السابق",
    },
    toSubscriptionType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "نوع الاشتراك الجديد",
    },
    fromStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "تاريخ بداية الاشتراك السابق",
    },
    fromEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "تاريخ نهاية الاشتراك السابق",
    },
    toStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "تاريخ بداية الاشتراك الجديد",
    },
    toEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "تاريخ نهاية الاشتراك الجديد",
    },
    fromValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "قيمة الاشتراك السابق",
    },
    toValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "قيمة الاشتراك الجديد",
    },
    transferDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "تاريخ التحويل",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "سبب التحويل",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "المستخدم الذي أنشأ التحويل",
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
    tableName: "SubscriptionTransfers",
    timestamps: true,
    indexes: [
      {
        fields: ["subscriptionId"],
      },
      {
        fields: ["memberId"],
      },
      {
        fields: ["transferDate"],
      },
      {
        fields: ["branchId"],
      },
    ],
  }
);

module.exports = SubscriptionTransfer;

