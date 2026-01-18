const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const MembershipType = sequelize.define(
  "MembershipType",
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in days",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "MembershipTypes",
    timestamps: true,
  }
);

module.exports = MembershipType;

