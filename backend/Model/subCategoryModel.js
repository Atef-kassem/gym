const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mainCategory_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "MainCategory",
        key: "id",
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "SubCategory",
    timestamps: false,
  }
);

module.exports = SubCategory;
