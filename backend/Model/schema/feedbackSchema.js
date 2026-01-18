const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "customer_id",
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    branch: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    overallRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "overall_rating",
    },
    criteriaRatings: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "criteria_ratings",
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sentiment: {
      type: DataTypes.ENUM("positive", "negative", "neutral"),
      allowNull: true,
    },
    npsScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "nps_score",
    },
    responseStatus: {
      type: DataTypes.ENUM("pending", "responded"),
      defaultValue: "pending",
      field: "response_status",
    },
    responseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "response_date",
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM("high", "medium", "normal"),
      defaultValue: "normal",
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "follow_up_required",
    },
    revenue: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    referrals: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "Feedbacks",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Feedback;


