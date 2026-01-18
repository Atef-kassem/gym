const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PurchaseRequisition = sequelize.define(
	"purchase_requisitions",
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		requestNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
		requestType: { type: DataTypes.STRING, allowNull: true },
		requestingDepartment: { type: DataTypes.STRING, allowNull: false },
		requiredDate: { type: DataTypes.DATEONLY, allowNull: true },
		priority: { type: DataTypes.ENUM("urgent", "normal", "low"), defaultValue: "normal" },
		notes: { type: DataTypes.TEXT, allowNull: true },
		estimatedValue: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
		status: { type: DataTypes.ENUM("draft", "pending", "approved", "rejected", "returned"), defaultValue: "draft" },
		branchId: { type: DataTypes.INTEGER, allowNull: true },
		createdBy: { type: DataTypes.INTEGER, allowNull: true },
	},
	{ tableName: "PurchaseRequisitions", timestamps: true }
);

module.exports = PurchaseRequisition;


