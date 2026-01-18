const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

// Forward declaration
let MembershipType;

const Member = sequelize.define(
  "Member",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(010|010)/,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmailOrEmpty(value) {
          if (value && value !== "" && value !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error("Please provide a valid email address");
          }
        }
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    membershipTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "MembershipTypes",
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Members",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = Member;

