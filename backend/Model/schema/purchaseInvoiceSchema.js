const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseInvoice = sequelize.define(
  "purchase_invoices",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    invoiceDate: { type: DataTypes.DATEONLY, allowNull: false },
    supplierId: { type: DataTypes.INTEGER, allowNull: false },
    purchaseOrderId: { type: DataTypes.INTEGER, allowNull: true },
    goodsReceiptId: { type: DataTypes.INTEGER, allowNull: true },
    dueDate: { type: DataTypes.DATEONLY, allowNull: true },
    paymentMethod: { type: DataTypes.STRING, allowNull: true },
    actualPaymentDate: { type: DataTypes.DATEONLY, allowNull: true },
    status: {
      // Arabic statuses to match UI directly
      type: DataTypes.ENUM(
        "بانتظار مطابقة",
        "تحت المراجعة",
        "بانتظار الموافقة",
        "بانتظار الدفع",
        "مدفوعة",
        "مرفوضة",
        "مجدول"
      ),
      defaultValue: "بانتظار مطابقة",
    },
    matchingStatus: {
      type: DataTypes.ENUM("تحت المراجعة", "مطابق", "غير مطابق"),
      defaultValue: "تحت المراجعة",
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    invoiceAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    approvedBy: { type: DataTypes.STRING, allowNull: true },
    attachments: { type: DataTypes.TEXT, allowNull: true }, // JSON string array of file links
  },
  {
    tableName: "PurchaseInvoices",
    timestamps: true,
  }
);

module.exports = PurchaseInvoice;


