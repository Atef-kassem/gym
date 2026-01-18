const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const RFQItem = sequelize.define(
  "rfq_items",
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    itemCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    sourceRequest: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "RFQItems",
    timestamps: true,
  }
);

module.exports = RFQItem;
