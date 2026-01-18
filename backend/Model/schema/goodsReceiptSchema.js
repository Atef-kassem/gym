const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const GoodsReceipt = sequelize.define(
  "goods_receipts",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    grnNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    purchaseOrderId: { type: DataTypes.INTEGER, allowNull: false },
    receiverName: { type: DataTypes.STRING, allowNull: false },
    receiptDate: { type: DataTypes.DATEONLY, allowNull: false },
    receiptTime: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM("draft", "partial", "completed", "rejected"), defaultValue: "draft" },
    signature: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "GoodsReceipts",
    timestamps: true,
  }
);

module.exports = GoodsReceipt;


