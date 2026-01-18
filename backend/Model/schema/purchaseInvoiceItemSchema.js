const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseInvoiceItem = sequelize.define(
  "purchase_invoice_items",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    purchaseInvoiceId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    total: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    poQuantity: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    grnQuantity: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    variance: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "PurchaseInvoiceItems",
    timestamps: true,
  }
);

module.exports = PurchaseInvoiceItem;


