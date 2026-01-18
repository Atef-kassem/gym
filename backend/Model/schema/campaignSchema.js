const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Campaign = sequelize.define(
  "Campaign",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("نشط", "مجدول", "منتهي", "متوقف"),
      defaultValue: "مجدول",
    },
    targetAudience: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    channel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    totalTargets: { type: DataTypes.INTEGER, defaultValue: 0 },
    sentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    openedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    respondedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    conversionRate: { type: DataTypes.FLOAT, defaultValue: 0 },
    revenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    discount: { type: DataTypes.STRING(50), allowNull: true },
    discountType: { type: DataTypes.STRING(50), allowNull: true },
    budget: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    spent: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    aiGenerated: { type: DataTypes.BOOLEAN, defaultValue: false },
    contentType: { type: DataTypes.STRING(50), allowNull: true },
    hashtags: { type: DataTypes.STRING(500), allowNull: true },
    location: { type: DataTypes.STRING(255), allowNull: true },
    ageRange: { type: DataTypes.STRING(50), allowNull: true },
    interests: { type: DataTypes.JSON, allowNull: true },
    socialMediaPlatforms: { type: DataTypes.JSON, allowNull: true },
    autoSchedule: { type: DataTypes.BOOLEAN, defaultValue: false },
    aiOptimization: { type: DataTypes.BOOLEAN, defaultValue: false },
    message: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "Campaigns",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Campaign;


