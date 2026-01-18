const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const warehousesSchema = require("./warehousesSchema");

const StockCountSession = sequelize.define(
  "StockCountSession",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: warehousesSchema,
        key: "warehouse_id",
      },
    },
    countType: {
      type: DataTypes.ENUM("دوري", "مستمر", "مفاجئ", "ذكي"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("جاري", "مكتمل", "معتمد", "ملغي", "معلق"),
      allowNull: false,
      defaultValue: "جاري",
    },
    teamMembers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    itemsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    discrepanciesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accuracy: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    riskLevel: {
      type: DataTypes.ENUM("منخفض", "متوسط", "عالي"),
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 3,
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
    tableName: "StockCountSessions",
    timestamps: true,
    indexes: [
      {
        fields: ["sessionNumber"],
      },
      {
        fields: ["warehouseId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["date"],
      },
    ],
  }
);

// Define associations
StockCountSession.belongsTo(warehousesSchema, {
  foreignKey: "warehouseId",
  as: "warehouse",
});

warehousesSchema.hasMany(StockCountSession, {
  foreignKey: "warehouseId",
  as: "stockCountSessions",
});

module.exports = StockCountSession;
