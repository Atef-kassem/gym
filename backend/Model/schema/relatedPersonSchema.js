const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const RelatedPerson = sequelize.define(
  "RelatedPerson",
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
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    relation: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "RelatedPersons",
    timestamps: true,
    underscored: true,
  }
);

module.exports = RelatedPerson;


