const { getAll, createOne, getOne, updateOne, deleteOne } = require("./factoryHandler");
const { RolePermission } = require("../Model");

const { Role, Permission } = require("../Model"); // Assuming associations are set up in the model
const catchAsync = require("../utils/catchAsync");

exports.getAllRolePermissions = catchAsync(async (req, res, next) => {
  const rolePermissions = await RolePermission.findAll({
    include: [
      {
        model: Role,
        attributes: ["id", "roleName", "description"],
      },
      { model: Permission, attributes: ["id", "permissionName", "description"] },
    ],
    attributes: ["id", "roleId", "permissionId"],
  });

  res.status(200).json({
    status: "success",
    data: rolePermissions,
  });
});
