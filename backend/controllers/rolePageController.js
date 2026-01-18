const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { Role, Page, RolePage, Permission, RolePermission } = require("../Model");

// ربط دور بصفحة
exports.assignPageToRole = catchAsync(async (req, res, next) => {
  const { roleId, pageId } = req.body;

  if (!roleId || !pageId) {
    return next(new appError("Role ID and Page ID are required", 400));
  }

  try {
    // التحقق من وجود الدور والصفحة
    const role = await Role.findByPk(roleId);
    const page = await Page.findByPk(pageId);

    if (!role) {
      return next(new appError("Role not found", 404));
    }

    if (!page) {
      return next(new appError("Page not found", 404));
    }

    // إنشاء أو تحديث الربط
    const [rolePage, created] = await RolePage.findOrCreate({
      where: { roleId, pageId },
      defaults: { roleId, pageId, isActive: true }
    });

    if (!created) {
      rolePage.isActive = true;
      await rolePage.save();
    }

    res.status(200).json({
      status: "success",
      data: { rolePage },
      message: created ? "Page assigned to role successfully" : "Page assignment updated successfully"
    });
  } catch (error) {
    console.error("Error assigning page to role:", error);
    return next(new appError("Error assigning page to role: " + error.message, 500));
  }
});

// إلغاء ربط دور بصفحة
exports.removePageFromRole = catchAsync(async (req, res, next) => {
  const { roleId, pageId } = req.params;

  try {
    const rolePage = await RolePage.findOne({
      where: { roleId, pageId }
    });

    if (!rolePage) {
      return next(new appError("Page is not assigned to this role", 404));
    }

    // حذف جميع الصلاحيات المرتبطة بهذه الصفحة والدور
    await RolePermission.destroy({
      where: { roleId, pageId }
    });

    // حذف الربط
    await rolePage.destroy();

    res.status(200).json({
      status: "success",
      message: "Page removed from role successfully"
    });
  } catch (error) {
    console.error("Error removing page from role:", error);
    return next(new appError("Error removing page from role: " + error.message, 500));
  }
});

// الحصول على الصفحات المرتبطة بدور
exports.getRolePages = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;

  try {
    const rolePages = await RolePage.findAll({
      where: { roleId, isActive: true },
      include: [
        {
          model: Page,
          as: "page",
          attributes: ["id", "pageName", "moduleName", "description"]
        }
      ]
    });

    res.status(200).json({
      status: "success",
      data: rolePages
    });
  } catch (error) {
    console.error("Error fetching role pages:", error);
    return next(new appError("Error fetching role pages: " + error.message, 500));
  }
});

// الحصول على جميع الصفحات مع حالة الربط بدور معين
exports.getAllPagesWithRoleStatus = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;

  try {
    const allPages = await Page.findAll({
      where: { isActive: true },
      order: [["moduleName", "ASC"], ["pageName", "ASC"]]
    });

    const rolePages = await RolePage.findAll({
      where: { roleId, isActive: true }
    });

    const pagesWithStatus = allPages.map(page => {
      const isAssigned = rolePages.some(rp => rp.pageId === page.id);
      return {
        ...page.toJSON(),
        isAssigned,
        rolePageId: isAssigned ? rolePages.find(rp => rp.pageId === page.id)?.id : null
      };
    });

    res.status(200).json({
      status: "success",
      data: pagesWithStatus
    });
  } catch (error) {
    console.error("Error fetching pages with role status:", error);
    return next(new appError("Error fetching pages with role status: " + error.message, 500));
  }
});

// حفظ صلاحيات دور على صفحة معينة
exports.saveRolePagePermissions = catchAsync(async (req, res, next) => {
  const { roleId, pageId, permissions } = req.body;

  if (!roleId || !pageId) {
    return next(new appError("Role ID and Page ID are required", 400));
  }

  try {
    // التحقق من وجود الربط بين الدور والصفحة
    const rolePage = await RolePage.findOne({
      where: { roleId, pageId, isActive: true }
    });

    if (!rolePage) {
      return next(new appError("Page is not assigned to this role", 400));
    }

    // حذف الصلاحيات القديمة
    await RolePermission.destroy({
      where: { roleId, pageId }
    });

    // إضافة الصلاحيات الجديدة
    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      const rolePermissions = permissions.map(permissionId => ({
        roleId,
        pageId,
        permissionId,
        isActive: true
      }));

      await RolePermission.bulkCreate(rolePermissions);
    }

    res.status(200).json({
      status: "success",
      message: "Role page permissions saved successfully"
    });
  } catch (error) {
    console.error("Error saving role page permissions:", error);
    return next(new appError("Error saving role page permissions: " + error.message, 500));
  }
});

// الحصول على صلاحيات دور على صفحة معينة
exports.getRolePagePermissions = catchAsync(async (req, res, next) => {
  const { roleId, pageId } = req.params;

  try {
    const rolePermissions = await RolePermission.findAll({
      where: { roleId, pageId, isActive: true },
      include: [
        {
          model: Permission,
          as: "permission",
          attributes: ["id", "permissionName", "description"]
        }
      ]
    });

    res.status(200).json({
      status: "success",
      data: rolePermissions
    });
  } catch (error) {
    console.error("Error fetching role page permissions:", error);
    return next(new appError("Error fetching role page permissions: " + error.message, 500));
  }
});
