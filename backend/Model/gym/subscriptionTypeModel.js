const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

// Gym subscription "types" (templates for subscriptions, not member subscriptions themselves)
const GymSubscriptionType = sequelize.define(
  "GymSubscriptionType",
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
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isTarget: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    availableAppeals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    availableBody: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isSpecialOffer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isForStudents: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    showInApp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sendNotificationToCustomers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notifyOnExpiry: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    walletPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    offerValidity: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isLinkedToSessions: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sessionsCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isLinkedToFreeze: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    freezeDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    includesSpa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    spaCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "GymSubscriptionTypes",
    timestamps: true,
  }
);

module.exports = GymSubscriptionType;


