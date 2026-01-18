const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Position = sequelize.define(
  "Position",
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
    tableName: "Positions",
    timestamps: true,
  }
);

module.exports = Position;

