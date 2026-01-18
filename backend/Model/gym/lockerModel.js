const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Locker = sequelize.define(
  "Locker",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lockerNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mainBranchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    subBranchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Lockers",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = Locker;

