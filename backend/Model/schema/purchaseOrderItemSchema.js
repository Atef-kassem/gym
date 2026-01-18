const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseOrderItem = sequelize.define(
  "purchase_order_items",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    purchaseOrderId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    specifications: { type: DataTypes.TEXT, allowNull: true },
    total: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "PurchaseOrderItems",
    timestamps: true,
  }
);

module.exports = PurchaseOrderItem;


