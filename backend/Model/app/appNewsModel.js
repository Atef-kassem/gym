const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const AppNews = sequelize.define(
  "AppNews",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Optional cover image for news",
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "AppNews",
    timestamps: true,
  }
);

module.exports = AppNews;

