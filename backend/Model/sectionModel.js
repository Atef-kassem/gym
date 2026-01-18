const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const Section = sequelize.define(
  "Section",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sectionName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Sections",
    timestamps: false,
  }
);

module.exports = Section;
