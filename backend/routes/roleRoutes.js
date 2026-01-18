const { 
  getAllRoles, 
  createRole, 
  updateRoleModules, 
  getRoleModules, 
  getModulesAndPagesData,
  getRolesWithUserCounts,
  debugDatabase,
  getRole,
  updateRole,
  deleteRole
} = require("../controllers/roleController");

const Router = require("express").Router();

Router.route("/").get(getAllRoles).post(createRole);
Router.route("/modules-data").get(getModulesAndPagesData);
Router.route("/users/counts").get(getRolesWithUserCounts);
Router.route("/debug").get(debugDatabase);
Router.route("/:id").get(getRole).patch(updateRole).delete(deleteRole);
Router.route("/:roleId/modules").put(updateRoleModules).get(getRoleModules);

module.exports = Router;
