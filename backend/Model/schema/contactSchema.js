const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Contact = sequelize.define(
  "Contact",
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
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "جوال",
    },
    value: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    tableName: "Contacts",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Contact;


