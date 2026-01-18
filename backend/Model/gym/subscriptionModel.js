const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");
// Associations are imported in Model/index.js

const Subscription = sequelize.define(
  "Subscription",
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
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    // ربط الاشتراك بعضو معين (مع إبقاء الاسم النصي للمزيد من المرونة)
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Members",
        key: "id",
      },
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscriptionType: {
      type: DataTypes.STRING,
      allowNull: false,
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
    remainingAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Employees",
        key: "id",
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "card", "bank", "online"),
      allowNull: true,
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
    isSpecial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "GymSubscriptions",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = Subscription;

