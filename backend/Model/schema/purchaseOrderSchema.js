const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseOrder = sequelize.define(
  "purchase_orders",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    poNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    requisitionId: { type: DataTypes.INTEGER, allowNull: true },
    supplierId: { type: DataTypes.INTEGER, allowNull: false },
    createdDate: { type: DataTypes.DATEONLY, allowNull: false },
    expectedDeliveryDate: { type: DataTypes.DATEONLY, allowNull: true },
    paymentTerms: { type: DataTypes.STRING, allowNull: true },
    deliveryTerms: { type: DataTypes.TEXT, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("draft", "sent", "confirmed", "in_progress", "completed", "cancelled"),
      defaultValue: "draft",
    },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "PurchaseOrders",
    timestamps: true,
  }
);

module.exports = PurchaseOrder;


