const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const LockerSubscription = sequelize.define(
  "LockerSubscription",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subscriptionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mainBranchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    subBranchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscriptionTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "LockerSubscriptionTypes",
        key: "id",
      },
    },
    subscriptionDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subscriptionStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    subscriptionEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    subscriptionValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    lockerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Lockers",
        key: "id",
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "card", "bank", "online"),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true,
    },
    recommendedEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Employees",
        key: "id",
      },
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "expired", "upcoming"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "LockerSubscriptions",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = LockerSubscription;

