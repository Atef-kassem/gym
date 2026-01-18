const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Group = sequelize.define(
  "Group",
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trainerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Employees",
        key: "id",
      },
    },
    trainerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schedule: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    maxMembers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    currentMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Branches",
        key: "id",
      },
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
    tableName: "Groups",
    timestamps: true,
  }
);

module.exports = Group;






