const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const AppOffer = sequelize.define(
  "AppOffer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Optional image URL for the offer banner",
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Discount percentage",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "AppOffers",
    timestamps: true,
  }
);

module.exports = AppOffer;

