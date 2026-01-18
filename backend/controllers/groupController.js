const { Group, GroupCategory, Branch, Employee } = require("../Model/index");
const { Op } = require("sequelize");

// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const { search, category, branchId } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { trainerName: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category) {
      where.category = category;
    }
    if (branchId) {
      where.branchId = branchId;
    }
    where.isActive = true;

    const groups = await Group.findAll({
      where,
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: Employee, as: "trainer", attributes: ["id", "arabicName", "englishName", "employeeCode"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: groups,
      count: groups.length,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching groups",
      error: error.message,
    });
  }
};

// Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "trainer" },
      ],
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching group",
      error: error.message,
    });
  }
};

// Create group
exports.createGroup = async (req, res) => {
  try {
    console.log('📥 بيانات المجموعة المستلمة:', req.body);

    let groupData = { ...req.body };

    // تحويل الحقول الفارغة إلى null
    if (groupData.trainerId === "" || groupData.trainerId === null) groupData.trainerId = null;
    if (groupData.trainerName === "" || groupData.trainerName === null) groupData.trainerName = null;
    if (groupData.schedule === "" || groupData.schedule === null) groupData.schedule = null;
    if (groupData.description === "" || groupData.description === null) groupData.description = null;
    if (groupData.branchId === "" || groupData.branchId === null) groupData.branchId = null;

    // تحويل الأرقام
    if (groupData.trainerId) groupData.trainerId = parseInt(groupData.trainerId);
    if (groupData.branchId) groupData.branchId = parseInt(groupData.branchId);
    if (groupData.maxMembers) groupData.maxMembers = parseInt(groupData.maxMembers) || 0;
    groupData.currentMembers = parseInt(groupData.currentMembers) || 0;

    // Validate required fields
    if (!groupData.name || !groupData.category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name and category are required",
      });
    }

    console.log('💾 محاولة إنشاء المجموعة في قاعدة البيانات...');
    const group = await Group.create(groupData);
    console.log('✅ تم إنشاء المجموعة بنجاح:', group.id);
    
    const groupWithRelations = await Group.findByPk(group.id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "trainer" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: groupWithRelations,
    });
  } catch (error) {
    console.error("❌ Error creating group:", error);
    console.error("❌ Error details:", {
      message: error.message,
      name: error.name,
      errors: error.errors,
    });
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${validationErrors}`,
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating group",
      error: error.message,
    });
  }
};

// Update group
exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    let groupData = { ...req.body };

    // تحويل الحقول الفارغة إلى null
    if (groupData.trainerId === "" || groupData.trainerId === null) groupData.trainerId = null;
    if (groupData.trainerName === "" || groupData.trainerName === null) groupData.trainerName = null;
    if (groupData.schedule === "" || groupData.schedule === null) groupData.schedule = null;
    if (groupData.description === "" || groupData.description === null) groupData.description = null;
    if (groupData.branchId === "" || groupData.branchId === null) groupData.branchId = null;

    // تحويل الأرقام
    if (groupData.trainerId) groupData.trainerId = parseInt(groupData.trainerId);
    if (groupData.branchId) groupData.branchId = parseInt(groupData.branchId);
    if (groupData.maxMembers) groupData.maxMembers = parseInt(groupData.maxMembers) || 0;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    await group.update(groupData);
    
    const groupWithRelations = await Group.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "trainer" },
      ],
    });

    res.json({
      success: true,
      message: "Group updated successfully",
      data: groupWithRelations,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({
      success: false,
      message: "Error updating group",
      error: error.message,
    });
  }
};

// Delete group
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    await group.update({ isActive: false });

    res.json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting group",
      error: error.message,
    });
  }
};

// Get group statistics
exports.getGroupStatistics = async (req, res) => {
  try {
    const total = await Group.count({ where: { isActive: true } });
    const categories = await GroupCategory.count({ where: { isActive: true } });
    const totalMembers = await Group.sum('currentMembers', { where: { isActive: true } }) || 0;
    const trainers = await Group.count({
      where: { isActive: true, trainerId: { [Op.ne]: null } },
      distinct: true,
      col: 'trainerId'
    });

    res.json({
      success: true,
      data: {
        total,
        categories,
        totalMembers: parseInt(totalMembers),
        trainers,
      },
    });
  } catch (error) {
    console.error("Error fetching group statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching group statistics",
      error: error.message,
    });
  }
};

// ========== Group Categories ==========

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await GroupCategory.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    const category = await GroupCategory.create(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await GroupCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.update(req.body);
    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await GroupCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.update({ isActive: false });
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};






