const { Employee, Branch, Department, Position, User, Role, UserRole } = require("../Model/index");
const sequelize = require("../Config/sequelize");
const { Op } = require("sequelize");

// Get all employees (including trainers)
exports.getAllEmployees = async (req, res) => {
  try {
    const { search, branchId, departmentId, positionId, employeeType, isActive } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { arabicName: { [Op.like]: `%${search}%` } },
        { englishName: { [Op.like]: `%${search}%` } },
        { employeeCode: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (departmentId) {
      where.departmentId = departmentId;
    }
    if (positionId) {
      where.positionId = positionId;
    }
    if (employeeType) {
      where.employeeType = employeeType;
    }
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const employees = await Employee.findAll({
      where,
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: Department, as: "department", attributes: ["id", "name"] },
        { model: Position, as: "position", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: employees,
      count: employees.length,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
};

// Get trainers only (currently: كل الموظفين النشطين ليظهروا ككباتن)
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Employee.findAll({
      // نكتفي بأن يكون الموظف نشطاً لاعتباره كابتن يمكن اختياره في الجيم
      where: {
        isActive: true,
      },
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
      ],
      order: [["arabicName", "ASC"]],
    });

    res.json({
      success: true,
      data: trainers,
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trainers",
      error: error.message,
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Department, as: "department" },
        { model: Position, as: "position" },
      ],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employee",
      error: error.message,
    });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log("📝 Creating employee - Request body:", req.body);
    console.log("📝 Request files:", req.files);
    
    // إعداد بيانات الموظف من req.body (يدعم FormData و JSON)
    // إذا لم يحدد الفرع نختار أول فرع متاح كقيمة افتراضية
    const defaultBranch =
      !req.body.branchId &&
      (await Branch.findOne({ order: [["id", "ASC"]] }));

    // Helper function to safely parse integer
    const safeParseInt = (value) => {
      if (!value || value === '' || value === 'null' || value === 'undefined' || value === null || value === undefined) {
        return null;
      }
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    };

    // Helper function to safely parse float
    const safeParseFloat = (value) => {
      if (!value || value === '' || value === 'null' || value === 'undefined' || value === null || value === undefined) {
        return null;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    const employeeData = {
      arabicName: req.body.arabicName || req.body.name,
      englishName: req.body.englishName || req.body.nameEn || req.body.arabicName || req.body.name,
      email: req.body.email || null,
      phone: req.body.phone || req.body.phoneNumber || '',
      branchId: req.body.branchId ? safeParseInt(req.body.branchId) : defaultBranch?.id || null,
      departmentId: safeParseInt(req.body.departmentId),
      positionId: safeParseInt(req.body.positionId),
      hireDate: req.body.hireDate || null,
      salary: safeParseFloat(req.body.salary),
      employeeType: req.body.employeeType || 'employee',
      specialization: req.body.specialization || null,
      experience: safeParseInt(req.body.experience),
      bio: req.body.bio || req.body.notes || null,
      isActive: req.body.isActive !== undefined ? req.body.isActive === 'true' || req.body.isActive === true : true,
    };

    console.log('📝 Parsed employee data:', {
      departmentId: employeeData.departmentId,
      positionId: employeeData.positionId,
      originalDepartmentId: req.body.departmentId,
      originalPositionId: req.body.positionId,
    });

    // معالجة الملفات المرفوعة (صورة الملف الشخصي)
    if (req.files && req.files.profilePicture) {
      const profilePicture = Array.isArray(req.files.profilePicture) 
        ? req.files.profilePicture[0] 
        : req.files.profilePicture;
      employeeData.profilePicture = `/Uploads/${profilePicture.filename}`;
    }

    // Generate employee code if not provided
    if (!req.body.employeeCode) {
      const lastEmployee = await Employee.findOne({
        order: [["id", "DESC"]],
      });
      const nextId = lastEmployee ? lastEmployee.id + 1 : 1;
      employeeData.employeeCode = `EMP${String(nextId).padStart(6, "0")}`;
    } else {
      employeeData.employeeCode = req.body.employeeCode;
    }

    // التحقق من البيانات المطلوبة
    if (!employeeData.arabicName) {
      return res.status(400).json({
        success: false,
        message: "اسم الموظف مطلوب",
      });
    }

    if (!employeeData.phone) {
      return res.status(400).json({
        success: false,
        message: "رقم الهاتف مطلوب",
      });
    }

    if (!employeeData.branchId) {
      return res.status(400).json({
        success: false,
        message: "لا يوجد فرع متاح لتعيينه كافتراضي",
      });
    }

    console.log("📝 Employee data to create:", employeeData);
    console.log("📝 Department ID:", employeeData.departmentId, "Type:", typeof employeeData.departmentId);
    console.log("📝 Position ID:", employeeData.positionId, "Type:", typeof employeeData.positionId);

    const employee = await Employee.create(employeeData, { transaction });
    
    console.log("✅ Employee created with ID:", employee.id);
    console.log("✅ Saved Department ID:", employee.departmentId);
    console.log("✅ Saved Position ID:", employee.positionId);

    // تنظيف رقم الهاتف بنفس طريقة authController
    let cleanPhoneNumber = employeeData.phone?.trim().replace(/[\s\-\(\)\+]/g, '');
    console.log('📱 Original phone:', employeeData.phone);
    console.log('📱 Cleaned phone:', cleanPhoneNumber);

    // التحقق من وجود مستخدم بنفس رقم الهاتف
    let existingUser = await User.findOne({
      where: { phoneNumber: cleanPhoneNumber },
      transaction
    });

    // إذا لم يتم العثور عليه، جرب البحث بدون البادئة 0 أو معها
    if (!existingUser && cleanPhoneNumber) {
      if (cleanPhoneNumber.startsWith('0')) {
        const phoneWithoutZero = cleanPhoneNumber.substring(1);
        existingUser = await User.findOne({
          where: { phoneNumber: phoneWithoutZero },
          transaction
        });
      } else {
        const phoneWithZero = '0' + cleanPhoneNumber;
        existingUser = await User.findOne({
          where: { phoneNumber: phoneWithZero },
          transaction
        });
      }
    }

    let user = null;
    let userRole = null;

    if (existingUser) {
      // إذا كان المستخدم موجوداً، نستخدمه بدلاً من إنشاء مستخدم جديد
      console.log('✅ Found existing user with phone number:', existingUser.id);
      user = existingUser;
      
      // تحديث بيانات المستخدم إذا لزم الأمر
      await user.update({
        arabicName: employeeData.arabicName,
        englinshName: employeeData.englishName || employeeData.arabicName,
        branchId: employeeData.branchId,
        sectionId: employeeData.departmentId,
        salary: employeeData.salary,
        active: employeeData.isActive,
        startDate: employeeData.hireDate || user.startDate || new Date(),
        profilePicture: employeeData.profilePicture || user.profilePicture,
      }, { transaction });

      // التحقق من وجود دور للمستخدم
      const existingUserRole = await UserRole.findOne({
        where: { userId: user.id },
        transaction
      });

      if (!existingUserRole) {
        // إسناد دور افتراضي للمستخدم إن لم يكن لديه دور
        const preferredRoles = ["employee", "Employee", "موظف"];
        let roleData = null;
        for (const roleName of preferredRoles) {
          roleData = await Role.findOne({ where: { roleName }, transaction });
          if (roleData) break;
        }

        if (roleData) {
          userRole = await UserRole.create(
            { userId: user.id, roleId: roleData.id },
            { transaction }
          );
          console.log(`✅ Assigned role '${roleData.roleName}' to existing user ${user.id}`);
        }
      } else {
        userRole = existingUserRole;
      }
    } else {
      // إنشاء حساب مستخدم جديد للموظف
      console.log('📝 Creating new user for employee');
      
      // التأكد من أن email و ssNumber فريدين
      let userEmail = employeeData.email || `${employeeData.employeeCode}@auto.local`;
      let userSsNumber = employeeData.employeeCode || `EMP${Date.now()}`;

      // التحقق من عدم وجود مستخدم بنفس email
      let emailExists = await User.findOne({
        where: { email: userEmail },
        transaction
      });
      let emailCounter = 0;
      while (emailExists) {
        emailCounter++;
        userEmail = `${employeeData.employeeCode}_${emailCounter}@auto.local`;
        emailExists = await User.findOne({
          where: { email: userEmail },
          transaction
        });
      }

      // التحقق من عدم وجود مستخدم بنفس ssNumber
      let ssNumberExists = await User.findOne({
        where: { ssNumber: userSsNumber },
        transaction
      });
      let ssNumberCounter = 0;
      while (ssNumberExists) {
        ssNumberCounter++;
        userSsNumber = `${employeeData.employeeCode}_${ssNumberCounter}`;
        ssNumberExists = await User.findOne({
          where: { ssNumber: userSsNumber },
          transaction
        });
      }

      const userPayload = {
        arabicName: employeeData.arabicName,
        englinshName: employeeData.englishName || employeeData.arabicName,
        ssNumber: userSsNumber,
        email: userEmail,
        password: "123456", // سيتم تشفيره تلقائياً في beforeCreate hook
        phoneNumber: cleanPhoneNumber, // استخدام الرقم المنظف
        telephoneNumber: req.body.telephoneNumber || null,
        branchId: employeeData.branchId,
        sectionId: employeeData.departmentId,
        salary: employeeData.salary,
        active: employeeData.isActive,
        startDate: employeeData.hireDate || new Date(),
        profilePicture: employeeData.profilePicture,
      };

      user = await User.create(userPayload, { transaction });
      console.log('✅ Created new user:', user.id);

      // إسناد دور افتراضي للمستخدم الجديد
      const preferredRoles = ["employee", "Employee", "موظف"];
      let roleData = null;
      for (const roleName of preferredRoles) {
        roleData = await Role.findOne({ where: { roleName }, transaction });
        if (roleData) break;
      }

      if (roleData) {
        userRole = await UserRole.create(
          { userId: user.id, roleId: roleData.id },
          { transaction }
        );
        console.log(`✅ Assigned role '${roleData.roleName}' to new user ${user.id}`);
      } else {
        console.warn("⚠️ لم يتم العثور على دور افتراضي للمستخدم الجديد");
      }
    }


    await transaction.commit();

    const employeeWithRelations = await Employee.findByPk(employee.id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Department, as: "department" },
        { model: Position, as: "position" },
      ],
    });

    console.log("✅ Employee created successfully:", employeeWithRelations.id);
    console.log("✅ Employee departmentId:", employeeWithRelations.departmentId);
    console.log("✅ Employee positionId:", employeeWithRelations.positionId);
    console.log("✅ Employee department:", employeeWithRelations.department?.name || 'null');
    console.log("✅ Employee position:", employeeWithRelations.position?.name || 'null');

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        employee: employeeWithRelations,
        user,
        userRole,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error creating employee:", error);
    
    // معالجة أخطاء قاعدة البيانات بشكل أفضل
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors?.[0]?.path || 'field';
      const value = error.errors?.[0]?.value || '';
      return res.status(400).json({
        success: false,
        message: `القيمة '${value}' موجودة بالفعل في حقل '${field}'. يرجى استخدام قيمة أخرى.`,
        error: error.message,
        field: field,
        value: value
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors?.map(e => e.message).join(', ') || error.message;
      return res.status(400).json({
        success: false,
        message: "خطأ في التحقق من البيانات",
        error: validationErrors,
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating employee",
      error: error.message,
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    console.log("📝 Updating employee - Request body:", req.body);
    console.log("📝 Request files:", req.files);

    // Helper function to safely parse integer
    const safeParseInt = (value) => {
      if (!value || value === '' || value === 'null' || value === 'undefined' || value === null || value === undefined) {
        return null;
      }
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    };

    // Helper function to safely parse float
    const safeParseFloat = (value) => {
      if (!value || value === '' || value === 'null' || value === 'undefined' || value === null || value === undefined) {
        return null;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    // إعداد بيانات الموظف من req.body (يدعم FormData و JSON)
    const employeeData = {
      arabicName: req.body.arabicName || req.body.name || employee.arabicName,
      englishName: req.body.englishName || req.body.nameEn || req.body.arabicName || req.body.name || employee.englishName,
      email: req.body.email !== undefined ? req.body.email : employee.email,
      phone: req.body.phone || req.body.phoneNumber || employee.phone,
      branchId: req.body.branchId ? safeParseInt(req.body.branchId) : employee.branchId,
      departmentId: req.body.departmentId !== undefined ? safeParseInt(req.body.departmentId) : employee.departmentId,
      positionId: req.body.positionId !== undefined ? safeParseInt(req.body.positionId) : employee.positionId,
      hireDate: req.body.hireDate || employee.hireDate,
      salary: req.body.salary !== undefined ? safeParseFloat(req.body.salary) : employee.salary,
      employeeType: req.body.employeeType || employee.employeeType,
      specialization: req.body.specialization !== undefined ? req.body.specialization : employee.specialization,
      experience: req.body.experience !== undefined ? safeParseInt(req.body.experience) : employee.experience,
      bio: req.body.bio !== undefined ? (req.body.bio || req.body.notes) : employee.bio,
      isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : employee.isActive,
    };

    console.log('📝 Parsed employee update data:', {
      departmentId: employeeData.departmentId,
      positionId: employeeData.positionId,
      originalDepartmentId: req.body.departmentId,
      originalPositionId: req.body.positionId,
    });

    // معالجة الملفات المرفوعة (صورة الملف الشخصي)
    if (req.files && req.files.profilePicture) {
      const profilePicture = Array.isArray(req.files.profilePicture) 
        ? req.files.profilePicture[0] 
        : req.files.profilePicture;
      employeeData.profilePicture = `/Uploads/${profilePicture.filename}`;
    }

    console.log("📝 Employee data to update:", employeeData);

    await employee.update(employeeData);
    
    const employeeWithRelations = await Employee.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Department, as: "department" },
        { model: Position, as: "position" },
      ],
    });

    console.log("✅ Employee updated successfully:", employeeWithRelations.id);

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: employeeWithRelations,
    });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({
      success: false,
      message: "Error updating employee",
      error: error.message,
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.destroy();

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting employee",
      error: error.message,
    });
  }
};

// Get departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching departments",
      error: error.message,
    });
  }
};

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department with this name already exists",
      });
    }

    const department = await Department.create({
      name,
      description: description || null,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      success: false,
      message: "Error creating department",
      error: error.message,
    });
  }
};

// Get positions
exports.getPositions = async (req, res) => {
  try {
    const positions = await Position.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching positions",
      error: error.message,
    });
  }
};

