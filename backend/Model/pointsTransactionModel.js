const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const PointsTransaction = sequelize.define('PointsTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customerName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('earned', 'redeemed', 'expired', 'bonus'),
    allowNull: false,
    validate: {
      isIn: [['earned', 'redeemed', 'expired', 'bonus']]
    }
  },
  points: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  reason: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  relatedOrderId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'PointsTransactions',
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['customerId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['date']
    },
    {
      fields: ['relatedOrderId']
    },
    {
      fields: ['expiryDate']
    }
  ]
});

// Hook to set expiry date for earned points
PointsTransaction.beforeCreate((transaction) => {
  if (transaction.type === 'earned' && !transaction.expiryDate) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    transaction.expiryDate = expiryDate.toISOString().split('T')[0];
  }
});

module.exports = PointsTransaction;
