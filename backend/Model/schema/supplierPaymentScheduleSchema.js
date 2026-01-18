const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const SupplierPaymentSchedule = sequelize.define(
  "supplier_payment_schedules",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    purchaseInvoiceId: { type: DataTypes.INTEGER, allowNull: false },
    scheduledDate: { type: DataTypes.DATEONLY, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("مجدول", "بانتظار الموافقة", "مدفوعة", "مرفوضة"),
      defaultValue: "مجدول",
    },
  },
  {
    tableName: "SupplierPaymentSchedules",
    timestamps: true,
  }
);

module.exports = SupplierPaymentSchedule;


