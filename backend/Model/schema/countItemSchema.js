const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const StockCountSession = require("./stockCountSessionSchema");
const productsSchema = require("./productsSchema");

const CountItem = sequelize.define(
  "CountItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    stockCountSessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: StockCountSession,
        key: "id",
      },
    },
    itemCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemType: {
      type: DataTypes.ENUM("product", "service", "sparePart", "consumable"),
      allowNull: false,
      defaultValue: "product",
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    physicalStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    variance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    variancePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalVarianceValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("مطابق", "فرق موجب", "فرق سالب"),
      allowNull: false,
      defaultValue: "مطابق",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aiConfidence: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    verificationMethod: {
      type: DataTypes.ENUM("باركود", "يدوي", "RFID", "AI"),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "CountItems",
    timestamps: true,
    indexes: [
      {
        fields: ["stockCountSessionId"],
      },
      {
        fields: ["itemCode"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["location"],
      },
    ],
  }
);

// Define associations
CountItem.belongsTo(StockCountSession, {
  foreignKey: "stockCountSessionId",
  as: "session",
});

// تعليق العلاقة مع products لأن itemCode قد يكون من جداول مختلفة
// CountItem.belongsTo(productsSchema, {
//   foreignKey: "itemCode",
//   targetKey: "product_id",
//   as: "product",
// });

StockCountSession.hasMany(CountItem, {
  foreignKey: "stockCountSessionId",
  as: "countItems",
});

// تعليق العلاقة العكسية مع products
// productsSchema.hasMany(CountItem, {
//   foreignKey: "itemCode",
//   sourceKey: "product_id",
//   as: "countItems",
// });

module.exports = CountItem;
