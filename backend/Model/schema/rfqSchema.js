const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const RFQ = sequelize.define(
  "rfqs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rfqNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestingDepartment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requiredDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "sent", "quotes_received", "under_comparison", "completed", "cancelled"),
      defaultValue: "draft",
    },
    priority: {
      type: DataTypes.ENUM("urgent", "normal", "low"),
      defaultValue: "normal",
    },
    estimatedBudget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    selectedVendorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    finalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    purchaseOrderNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    archivedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    archivedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    archiveReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "RFQs",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = RFQ;
