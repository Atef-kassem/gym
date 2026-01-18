const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const StockCountSession = require("./stockCountSessionSchema");
const productsSchema = require("./productsSchema");

const Adjustment = sequelize.define(
  "Adjustment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    adjustmentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adjustmentType: {
      type: DataTypes.ENUM("زائد", "أقفل"),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("قيد المراجعة", "معلقة", "معتمد", "مرفوض"),
      allowNull: false,
      defaultValue: "قيد المراجعة",
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
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
    tableName: "Adjustments",
    timestamps: true,
    indexes: [
      {
        fields: ["stockCountSessionId"],
      },
      {
        fields: ["adjustmentNumber"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["itemCode"],
      },
    ],
  }
);

// Define associations
Adjustment.belongsTo(StockCountSession, {
  foreignKey: "stockCountSessionId",
  as: "session",
});

// تعطيل الـ association مع Products لأن itemCode قد يكون spare part أو consumable
// Adjustment.belongsTo(productsSchema, {
//   foreignKey: "itemCode",
//   targetKey: "product_id",
//   as: "product",
// });

StockCountSession.hasMany(Adjustment, {
  foreignKey: "stockCountSessionId",
  as: "adjustments",
});

// تعطيل الـ association العكسية أيضاً
// productsSchema.hasMany(Adjustment, {
//   foreignKey: "itemCode",
//   sourceKey: "product_id",
//   as: "adjustments",
// });

module.exports = Adjustment;
