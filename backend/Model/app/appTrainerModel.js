const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const AppTrainer = sequelize.define(
  "AppTrainer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Employees",
        key: "id",
      },
      comment: "Link to HR Employee if exists",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Years of experience",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Optional profile image for trainer",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "AppTrainers",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = AppTrainer;

