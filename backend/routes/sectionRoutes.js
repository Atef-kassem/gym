const Router = require("express").Router();
const { getAllSections } = require("../controllers/sections");

Router.route("/").get(getAllSections);

module.exports = Router;
