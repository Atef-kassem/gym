const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    arabicName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    englishName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Departments",
        key: "id",
      },
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Positions",
        key: "id",
      },
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    employeeType: {
      type: DataTypes.ENUM("employee", "trainer", "manager", "admin"),
      allowNull: false,
      defaultValue: "employee",
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Years of experience",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Employees",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = Employee;

