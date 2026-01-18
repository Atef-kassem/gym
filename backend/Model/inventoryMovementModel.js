const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const InventoryMovement = sequelize.define('InventoryMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  transactionType: {
    type: DataTypes.ENUM(
      'إدخال مشتريات',
      'إدخال مرتجع مبيعات',
      'صرف مبيعات',
      'صرف إنتاج',
      'صرف استهلاك',
      'تحويل داخلي',
      'إدخال تحويل داخلي',
      'تسوية جرد',
      'إدخال تالف',
      'إرجاع لمورد'
    ),
    allowNull: false
  },
  itemCode: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  itemName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(15, 3),
    allowNull: false
  },
  uom: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  warehouse: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  docRef: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  docType: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  cost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0
  },
  batchNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 3),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  supplier: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  riskLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
    defaultValue: 'low'
  },
  predictedDemand: {
    type: DataTypes.DECIMAL(15, 3),
    allowNull: true
  },
  seasonalTrend: {
    type: DataTypes.ENUM('increasing', 'decreasing', 'stable'),
    allowNull: true,
    defaultValue: 'stable'
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Branches',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'INVENTORY_MOVEMENTS',
  timestamps: true,
  indexes: [
    {
      fields: ['transactionDate']
    },
    {
      fields: ['itemCode']
    },
    {
      fields: ['transactionType']
    },
    {
      fields: ['warehouse']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['branchId']
    }
  ]
});

module.exports = InventoryMovement;
