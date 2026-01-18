const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const CampaignTarget = sequelize.define(
  "CampaignTarget",
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
    campaignId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "campaign_id",
    },
  },
  {
    tableName: "CampaignTargets",
    timestamps: true,
    underscored: true,
  }
);

module.exports = CampaignTarget;


