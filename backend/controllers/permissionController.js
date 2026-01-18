const { createOne, getAll } = require("../controllers/factoryHandler");
const { Permission, Page } = require("../Model");
const catchAsync = require("../utils/catchAsync");

exports.createPermission = catchAsync(async (req, res, next) => {
  const { permissionName, description } = req.body;

  if (!permissionName) {
    return next(new Error("Permission name is required"));
  }

  const newPermission = await Permission.create({
    permissionName,
    description,
  });

  res.status(201).json({
    status: "success",
    data: newPermission,
    message: "Permission created successfully",
  });
});

exports.getAllPermissions = getAll("Permission");

// الحصول على أنواع الصلاحيات
exports.getPermissionTypes = catchAsync(async (req, res, next) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ["id", "permissionName", "description"],
      order: [["permissionName", "ASC"]]
    });

    res.status(200).json({
      status: "success",
      permissions: permissions
    });
  } catch (error) {
    console.error("Error fetching permission types:", error);
    return next(new Error("Error fetching permission types: " + error.message));
  }
});

// الحصول على الوحدات النظامية
exports.getSystemModules = catchAsync(async (req, res, next) => {
  try {
    const pages = await Page.findAll({
      attributes: ["id", "pageName", "pageTitle", "moduleName", "description"],
      order: [["moduleName", "ASC"], ["pageName", "ASC"]]
    });

    // تجميع الصفحات حسب الوحدات
    const modules = {};
    pages.forEach(page => {
      if (!modules[page.moduleName]) {
        modules[page.moduleName] = {
          id: page.moduleName,
          name: page.moduleName,
          screens: []
        };
      }
      modules[page.moduleName].screens.push({
        pageName: page.pageName,
        pageTitle: page.pageTitle || page.pageName // استخدام pageTitle إذا كان موجوداً، وإلا pageName
      });
    });

    const modulesArray = Object.values(modules);

    res.status(200).json({
      status: "success",
      modules: modulesArray
    });
  } catch (error) {
    console.error("Error fetching system modules:", error);
    return next(new Error("Error fetching system modules: " + error.message));
  }
});
