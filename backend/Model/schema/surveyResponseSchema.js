const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const SurveyResponse = sequelize.define(
  "SurveyResponse",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    surveyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "survey_id",
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "customer_id",
    },
    customerName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "customer_name",
    },
    submittedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "submitted_date",
    },
    responses: {
      type: DataTypes.JSON,
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
    completionTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "completion_time",
    },
  },
  {
    tableName: "SurveyResponses",
    timestamps: true,
    underscored: true,
  }
);

module.exports = SurveyResponse;
