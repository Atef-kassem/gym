const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const ExerciseCategory = sequelize.define(
  "ExerciseCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "ExerciseCategories",
    timestamps: true,
  }
);

module.exports = ExerciseCategory;

