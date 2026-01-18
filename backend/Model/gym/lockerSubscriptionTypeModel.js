const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const LockerSubscriptionType = sequelize.define(
  "LockerSubscriptionType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metaValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mtaValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hasStop: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    stopDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isTargetBased: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "LockerSubscriptionTypes",
    timestamps: true,
  }
);

module.exports = LockerSubscriptionType;

