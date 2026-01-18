const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Quotation = sequelize.define(
  "quotations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rfqId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    deliveryTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receivedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("accepted", "rejected", "pending", "under_review"),
      defaultValue: "pending",
    },
    vendorRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    aiScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qualityScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    priceCompetitiveness: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Quotations",
    timestamps: true,
  }
);

module.exports = Quotation;
