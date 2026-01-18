const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const Subscription = sequelize.define('Subscription', {
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
  customerEmail: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  planId: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  planName: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  planPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('نشط', 'منتهي', 'متوقف', 'تجربة'),
    allowNull: false,
    defaultValue: 'نشط'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'بطاقة ائتمان'
  },
  nextBillingDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  totalPaid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  discountApplied: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
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
  tableName: 'Subscriptions',
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['customerId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['planId']
    },
    {
      fields: ['startDate', 'endDate']
    },
    {
      fields: ['customerEmail']
    }
  ]
});

// Hook to validate dates
Subscription.beforeValidate((subscription) => {
  if (subscription.startDate && subscription.endDate) {
    if (new Date(subscription.startDate) >= new Date(subscription.endDate)) {
      throw new Error('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
    }
  }
});

// Hook to calculate next billing date
Subscription.beforeSave((subscription) => {
  if (subscription.autoRenew && subscription.endDate) {
    const endDate = new Date(subscription.endDate);
    endDate.setMonth(endDate.getMonth() + 1);
    subscription.nextBillingDate = endDate.toISOString().split('T')[0];
  }
});

module.exports = Subscription;
