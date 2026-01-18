const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const categoriesSchema = sequelize.define("Categories", {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_ar: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  name_en: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  parent_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Categories",
      key: "category_id",
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: "Categories",
  timestamps: false,
});

module.exports = categoriesSchema;
