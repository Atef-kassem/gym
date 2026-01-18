const { getSystemModules, getPermissionTypes, getRoleStatistics } = require("../controllers/systemController");

const Router = require("express").Router();

Router.route("/modules").get(getSystemModules);
Router.route("/permissions").get(getPermissionTypes);
Router.route("/roles/statistics").get(getRoleStatistics);

module.exports = Router;
