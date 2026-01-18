const AppError = require("../utils/appError");
const { User, UserRole, Role } = require("../Model/index");

module.exports = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get user roles from UserRole table
      const userRoles = await UserRole.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['roleName']
          }
        ]
      });

      // Check if user has any of the required roles
      const hasRequiredRole = userRoles.some(userRole => 
        roles.includes(userRole.role.roleName)
      );

      if (!hasRequiredRole) {
        return next(new AppError("You do not have permission to perform this action", 403));
      }

      next();
    } catch (error) {
      return next(new AppError("Error checking user permissions", 500));
    }
  };
};
