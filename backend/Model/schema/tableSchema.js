const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Table = sequelize.define(
  "tables",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    tableNumber: { 
      type: DataTypes.STRING, 
      allowNull: false,
      comment: "رقم الطاولة"
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false,
      comment: "اسم الطاولة"
    },
    branchId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "معرف الفرع"
    },
    branchName: { 
      type: DataTypes.STRING, 
      allowNull: true,
      comment: "اسم الفرع"
    },
    capacity: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "عدد الكج.مي"
    },
    status: { 
      type: DataTypes.ENUM("available", "occupied", "reserved", "maintenance"), 
      defaultValue: "available",
      comment: "حالة الطاولة"
    },
    location: { 
      type: DataTypes.STRING, 
      allowNull: true,
      comment: "موقع الطاولة"
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "وصف الطاولة"
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true,
      comment: "حالة النشاط"
    },
    createdBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف المستخدم المنشئ"
    },
    updatedBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف المستخدم المحدث"
    }
  },
  {
    tableName: "TABLES",
    timestamps: true,
    comment: "جدول إدارة الطاولات"
  }
);

module.exports = Table;
