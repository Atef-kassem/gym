const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Car = sequelize.define(
  "Car",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "customer_id",
    },
    plate: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    make: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    fuelType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    transmission: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    engineSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    vehicleType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    chassisNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    odometerReading: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    recommendedOilQuantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "Cars",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["plate"] }],
  }
);

module.exports = Car;


