const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseReturnItem = sequelize.define(
  "purchase_return_items",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    purchaseReturnId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    itemCode: { type: DataTypes.STRING, allowNull: true },
    returnedQty: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: true },
    batchNumber: { type: DataTypes.STRING, allowNull: true },
    condition: { type: DataTypes.STRING, allowNull: true },
    reason: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    total: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "PurchaseReturnItems",
    timestamps: true,
  }
);

module.exports = PurchaseReturnItem;


