const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
