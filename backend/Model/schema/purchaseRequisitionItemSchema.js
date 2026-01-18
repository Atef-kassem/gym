const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseRequisitionItem = sequelize.define(
	"purchase_requisition_items",
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		requisitionId: { type: DataTypes.INTEGER, allowNull: false },
		name: { type: DataTypes.STRING, allowNull: false },
		quantity: { type: DataTypes.STRING, allowNull: false },
		unit: { type: DataTypes.STRING, allowNull: true },
		specifications: { type: DataTypes.TEXT, allowNull: true },
		estimatedPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
	},
	{ tableName: "PurchaseRequisitionItems", timestamps: true }
);

module.exports = PurchaseRequisitionItem;


