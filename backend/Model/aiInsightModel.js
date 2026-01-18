const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const AIInsight = sequelize.define('AIInsight', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('trend', 'alert', 'recommendation', 'prediction'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  impact: {
    type: DataTypes.ENUM('high', 'medium', 'low'),
    allowNull: false,
    defaultValue: 'medium'
  },
  confidence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  actionRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
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
  tableName: 'AI_INSIGHTS',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['impact']
    },
    {
      fields: ['category']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['branchId']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = AIInsight;
