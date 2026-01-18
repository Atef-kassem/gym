const {createOne, getAll} = require("./factoryHandler");
const {UserRole} = require("../Model");

exports.createUserRole = createOne(UserRole, ["userId", "roleId"]);
exports.getAllUserRoles = getAll(UserRole);