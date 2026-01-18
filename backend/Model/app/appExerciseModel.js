const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const AppExercise = sequelize.define(
  "AppExercise",
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ExerciseCategories",
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Duration in minutes",
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Optional image/thumbnail for exercise",
    },
  },
  {
    tableName: "AppExercises",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = AppExercise;

