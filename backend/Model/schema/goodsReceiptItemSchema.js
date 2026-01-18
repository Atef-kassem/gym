const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const GoodsReceiptItem = sequelize.define(
  "goods_receipt_items",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    goodsReceiptId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    orderedQty: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    receivedQty: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: true },
    condition: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    rejected: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    tableName: "GoodsReceiptItems",
    timestamps: true,
  }
);

module.exports = GoodsReceiptItem;


