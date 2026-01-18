const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const GroupCategory = sequelize.define(
  "GroupCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#3B82F6",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "GroupCategories",
    timestamps: true,
  }
);

module.exports = GroupCategory;






