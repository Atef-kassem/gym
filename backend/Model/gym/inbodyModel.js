const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Inbody = sequelize.define(
  "Inbody",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Members",
        key: "id",
      },
    },
    measurementDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    bodyFat: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    muscleMass: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    bmi: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Inbodies",
    timestamps: true,
  }
);

module.exports = Inbody;

