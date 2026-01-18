const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const OfferFavorite = sequelize.define(
  "OfferFavorite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    offerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "معرف العرض",
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "معرف العضو",
    },
  },
  {
    tableName: "OfferFavorites",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["offerId", "memberId"],
        name: "unique_offer_member",
      },
      {
        fields: ["memberId"],
      },
      {
        fields: ["offerId"],
      },
    ],
  }
);

module.exports = OfferFavorite;

