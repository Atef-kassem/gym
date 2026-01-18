const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const AboutApp = sequelize.define(
  "AboutApp",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appVersion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    privacyPolicy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    termsOfService: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "AboutApp",
    timestamps: true,
  }
);

module.exports = AboutApp;

