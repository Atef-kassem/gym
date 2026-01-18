const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const productBranchesSchema = sequelize.define("product_branches", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: "Products",
      key: "product_id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Branches",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "ProductBranches",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      unique: true,
      fields: ["product_id", "branch_id"],
      name: "unique_product_branch",
    },
  ],
});

module.exports = productBranchesSchema;