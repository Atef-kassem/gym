const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseReturn = sequelize.define(
  "purchase_returns",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    returnNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    returnDate: { type: DataTypes.DATEONLY, allowNull: false },
    purchaseOrderId: { type: DataTypes.INTEGER, allowNull: true },
    goodsReceiptId: { type: DataTypes.INTEGER, allowNull: true },
    supplierId: { type: DataTypes.INTEGER, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM(
        "بانتظار الموافقة",
        "معتمد",
        "مرفوض",
        "مكتمل",
        "تحت التسوية المالية",
        "مسوى"
      ),
      defaultValue: "بانتظار الموافقة",
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    approvedBy: { type: DataTypes.STRING, allowNull: true },
    branchId: { type: DataTypes.STRING, allowNull: true },
    branchName: { type: DataTypes.STRING, allowNull: true },
    totalItems: { type: DataTypes.INTEGER, allowNull: true },
    totalValue: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    attachments: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "PurchaseReturns",
    timestamps: true,
  }
);

module.exports = PurchaseReturn;


