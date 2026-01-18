const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const DebitNoteItem = sequelize.define('debit_note_item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  debit_note_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'DEBIT_NOTES',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'piece'
  },
  item_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: 'Products',
      key: 'product_id'
    }
  },
  purchase_order_item_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PurchaseOrderItems',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'DEBIT_NOTE_ITEMS',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = DebitNoteItem;
