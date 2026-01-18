const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");
const { Role, UserRole, User } = require("../Model");
const catchAsync = require("../utils/catchAsync");
const { createOne, getOne, getAll, updateOne, deleteOne } = require("./factoryHandler");
const appError = require("../utils/appError");

exports.getAllRoles = catchAsync(async (req, res, next) => {
  try {
    const roles = await Role.findAll();

    res.status(200).json({
      status: "success",
      data: roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return next(new appError("Error fetching roles: " + error.message, 500));
  }
});

exports.createRole = catchAsync(async (req, res, next) => {
  const { roleName, description, modules } = req.body;

  console.log("Received data:", { roleName, description, modules });

  // Check if roleName and description are provided
  if (!roleName || !description) {
    return next(new appError("Role name and description are required", 400));
  }

  try {
    // Create role with modules
    const newRole = await Role.create({ 
      roleName, 
      description, 
      modules: modules || {} 
    });
    
    console.log("Role created:", newRole.toJSON());

    res.status(201).json({
      status: "success",
      data: {
        role: newRole,
      },
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return next(new appError("Error creating role: " + error.message, 500));
  }
});

exports.updateRoleModules = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;
  const { modules } = req.body;

  console.log("Updating role modules:", { roleId, modules });

  if (!roleId) {
    return next(new appError("Role ID is required", 400));
  }

  try {
    // Find the role
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      return next(new appError("Role not found", 404));
    }

    // Update the modules
    role.modules = modules || {};
    await role.save();

    console.log("Role modules updated:", role.toJSON());

    res.status(200).json({
      status: "success",
      data: {
        role: role,
      },
    });
  } catch (error) {
    console.error("Error updating role modules:", error);
    return next(new appError("Error updating role modules: " + error.message, 500));
  }
});

exports.getRoleModules = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;

  if (!roleId) {
    return next(new appError("Role ID is required", 400));
  }

  try {
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      return next(new appError("Role not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        modules: role.modules || {}
      },
    });
  } catch (error) {
    console.error("Error fetching role modules:", error);
    return next(new appError("Error fetching role modules: " + error.message, 500));
  }
});

exports.getModulesAndPagesData = catchAsync(async (req, res, next) => {
  try {
    const modulesAndPagesData = require("../data/modulesAndPagesData");
    
    res.status(200).json({
      status: "success",
      data: modulesAndPagesData,
    });
  } catch (error) {
    console.error("Error fetching modules and pages data:", error);
    return next(new appError("Error fetching modules and pages data: " + error.message, 500));
  }
});

// Get all roles with user counts
exports.getRolesWithUserCounts = catchAsync(async (req, res, next) => {
  try {
    console.log("🔍 Backend: Starting getRolesWithUserCounts...");
    
    // Get all roles
    const roles = await Role.findAll();
    console.log("🔍 Backend: Found roles:", roles.map(r => ({ id: r.id, name: r.roleName })));
    
    // Get user counts for each role
    const rolesWithUserCounts = await Promise.all(
      roles.map(async (role) => {
        console.log(`🔍 Backend: Counting users for role ${role.id} (${role.roleName})`);
        
        // First, let's check what's in UserRole table
        const userRoles = await UserRole.findAll({
          where: { roleId: role.id }
        });
        console.log(`🔍 Backend: UserRole records for role ${role.id}:`, userRoles);
        
        const userCount = userRoles.length;
        console.log(`🔍 Backend: Role ${role.id} has ${userCount} users`);
        
        return {
          roleId: role.id,
          roleName: role.roleName,
          description: role.description,
          userCount: userCount
        };
      })
    );
    
    console.log("🔍 Backend: Final result:", rolesWithUserCounts);
    
    res.status(200).json({
      status: "success",
      data: rolesWithUserCounts
    });
  } catch (error) {
    console.error("❌ Backend: Error getting roles with user counts:", error);
    return next(new appError("Error fetching roles with user counts: " + error.message, 500));
  }
});

// Debug endpoint to check database state
exports.debugDatabase = catchAsync(async (req, res, next) => {
  try {
    console.log("🔍 Backend: Debug endpoint called...");
    
    // Check all roles
    const roles = await Role.findAll();
    console.log("🔍 Backend: All roles:", roles.map(r => ({ id: r.id, name: r.roleName })));
    
    // Check all users
    const users = await User.findAll();
    console.log("🔍 Backend: All users:", users.map(u => ({ id: u.id, name: u.arabicName, email: u.email })));
    
    // Check all user-role relationships
    const userRoles = await UserRole.findAll();
    console.log("🔍 Backend: All UserRole records:", userRoles.map(ur => ({ userId: ur.userId, roleId: ur.roleId })));
    
    res.status(200).json({
      status: "success",
      data: {
        roles: roles.map(r => ({ id: r.id, name: r.roleName })),
        users: users.map(u => ({ id: u.id, name: u.arabicName, email: u.email })),
        userRoles: userRoles.map(ur => ({ userId: ur.userId, roleId: ur.roleId }))
      }
    });
  } catch (error) {
    console.error("❌ Backend: Error in debug endpoint:", error);
    return next(new appError("Error in debug endpoint: " + error.message, 500));
  }
});

// Get a specific role by ID
exports.getRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new appError("Role ID is required", 400));
  }

  try {
    const role = await Role.findByPk(id);
    
    if (!role) {
      return next(new appError("Role not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        role: role,
      },
    });
  } catch (error) {
    console.error("Error fetching role:", error);
    return next(new appError("Error fetching role: " + error.message, 500));
  }
});

// Update a specific role by ID
exports.updateRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { roleName, description, modules } = req.body;

  if (!id) {
    return next(new appError("Role ID is required", 400));
  }

  try {
    const role = await Role.findByPk(id);
    
    if (!role) {
      return next(new appError("Role not found", 404));
    }

    // Update the role fields
    if (roleName !== undefined) role.roleName = roleName;
    if (description !== undefined) role.description = description;
    if (modules !== undefined) role.modules = modules;

    await role.save();

    res.status(200).json({
      status: "success",
      data: {
        role: role,
      },
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return next(new appError("Error updating role: " + error.message, 500));
  }
});

// Delete a specific role by ID
exports.deleteRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new appError("Role ID is required", 400));
  }

  try {
    const role = await Role.findByPk(id);
    
    if (!role) {
      return next(new appError("Role not found", 404));
    }

    // Check if there are users assigned to this role
    const userCount = await UserRole.count({
      where: { roleId: id }
    });

    if (userCount > 0) {
      return next(new appError(`Cannot delete role. There are ${userCount} users assigned to this role.`, 400));
    }

    await role.destroy();

    res.status(200).json({
      status: "success",
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return next(new appError("Error deleting role: " + error.message, 500));
  }
});
