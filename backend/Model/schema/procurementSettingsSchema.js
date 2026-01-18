const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const ProcurementSettings = sequelize.define(
	"procurement_settings",
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		minOrderAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
		maxDirectPurchase: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
		requireParallelApproval: { type: DataTypes.BOOLEAN, defaultValue: false },
		orderValidityDays: { type: DataTypes.INTEGER, defaultValue: 30 },
		enableQuickApproval: { type: DataTypes.BOOLEAN, defaultValue: true },
		enableMobileApproval: { type: DataTypes.BOOLEAN, defaultValue: true },
		autoRFQ: { type: DataTypes.BOOLEAN, defaultValue: false },

		requireContract: { type: DataTypes.BOOLEAN, defaultValue: true },
		linkVendorRating: { type: DataTypes.BOOLEAN, defaultValue: true },
		vendorCreditLimit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
		autoVendorNotification: { type: DataTypes.BOOLEAN, defaultValue: true },

		checkStockBeforePurchase: { type: DataTypes.BOOLEAN, defaultValue: true },
		allowBranchTransfer: { type: DataTypes.BOOLEAN, defaultValue: true },
		enableERPIntegration: { type: DataTypes.BOOLEAN, defaultValue: false },

		enableThreeWayMatch: { type: DataTypes.BOOLEAN, defaultValue: true },
		requirePOInInvoice: { type: DataTypes.BOOLEAN, defaultValue: true },
		autoPaymentScheduling: { type: DataTypes.BOOLEAN, defaultValue: false },

		emailNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
		smsNotifications: { type: DataTypes.BOOLEAN, defaultValue: false },
		inSystemNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
		mobileAppNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
		stockAlertThreshold: { type: DataTypes.INTEGER, defaultValue: 20 },
		dueBillsAlert: { type: DataTypes.BOOLEAN, defaultValue: true },
		vendorDelayAlert: { type: DataTypes.BOOLEAN, defaultValue: true },

		allowedFileTypes: { type: DataTypes.JSON, defaultValue: ["PDF", "Word", "Images"] },
		maxFileSize: { type: DataTypes.INTEGER, defaultValue: 10 },
		requireMandatoryAttachments: { type: DataTypes.BOOLEAN, defaultValue: false },
		keepOldVersions: { type: DataTypes.BOOLEAN, defaultValue: true },

		weeklyReport: { type: DataTypes.BOOLEAN, defaultValue: false },
		monthlyReport: { type: DataTypes.BOOLEAN, defaultValue: true },
		quarterlyReport: { type: DataTypes.BOOLEAN, defaultValue: false },
		budgetExceedAlert: { type: DataTypes.BOOLEAN, defaultValue: true },
	},
	{ tableName: "ProcurementSettings", timestamps: true }
);

module.exports = ProcurementSettings;


