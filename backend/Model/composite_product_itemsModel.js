// models/composite_product_itemsModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const CompositeProductItem = sequelize.define("CompositeProductItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  compositeProductId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: "CompositeProductItem",
  timestamps: false,
});

module.exports = CompositeProductItem;
