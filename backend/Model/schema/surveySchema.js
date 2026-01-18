const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Survey = sequelize.define(
  "Survey",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "active", "paused", "completed", "archived"),
      defaultValue: "draft",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "end_date",
    },
    responseCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "response_count",
    },
    targetCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "target_count",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("satisfaction", "nps", "feedback", "market_research", "employee"),
      defaultValue: "satisfaction",
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    distribution: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    analytics: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "Surveys",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Survey;
