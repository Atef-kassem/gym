const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

/**
 * جدول ربط الخدمات بالمواد المستهلكة
 * يحدد المواد المستهلكة المطلوبة لكل خدمة وكمياتها
 */
const ServiceConsumables = sequelize.define("ServiceConsumables", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'service_id',
    references: {
      model: "Services",
      key: "id",
    },
    comment: "معرف الخدمة"
  },
  consumableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'consumable_id',
    references: {
      model: "Consumables",
      key: "id",
    },
    comment: "معرف المادة المستهلكة"
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.0,
    comment: "الكمية المطلوبة من المادة لتنفيذ الخدمة"
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: "وحدة القياس"
  },
  isOptional: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_optional',
    comment: "هل المادة اختيارية؟"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات حول استخدام المادة"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
    comment: "هل العلاقة نشطة؟"
  }
}, {
  tableName: "service_consumables",
  timestamps: true,
  underscored: true,
  comment: "جدول ربط الخدمات بالمواد المستهلكة",
  indexes: [
    {
      unique: false,
      fields: ['service_id']
    },
    {
      unique: false,
      fields: ['consumable_id']
    },
    {
      unique: true,
      fields: ['service_id', 'consumable_id'],
      name: 'unique_service_consumable'
    }
  ]
});

module.exports = ServiceConsumables;

