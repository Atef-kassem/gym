const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50]
    }
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('نسبة مئوية', 'مبلغ ثابت', 'خدمة مجانية', 'نقاط مضاعفة', 'شحن مجاني'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  usedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  customerLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  applicableServices: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  targetCustomers: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  branches: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  channels: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('نشط', 'مجدول', 'منتهي', 'متوقف'),
    allowNull: false,
    defaultValue: 'نشط'
  },
  autoApply: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  stackable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  firstTimeOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  revenue: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  conversionRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  customerSegment: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  avgOrderValue: {
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
  tableName: 'Coupons',
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    },
    {
      fields: ['startDate', 'endDate']
    }
  ]
});

// Hook to validate dates
Coupon.beforeValidate((coupon) => {
  if (coupon.startDate && coupon.endDate) {
    if (new Date(coupon.startDate) >= new Date(coupon.endDate)) {
      throw new Error('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
    }
  }
});

// Hook to calculate conversion rate
Coupon.beforeSave((coupon) => {
  if (coupon.usageLimit > 0) {
    coupon.conversionRate = (coupon.usedCount / coupon.usageLimit) * 100;
  }
});

module.exports = Coupon;
