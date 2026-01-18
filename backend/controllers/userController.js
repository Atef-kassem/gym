const User = require("../Model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { deleteOne, updateOne, getOne, getAll } = require("./factoryHandler");
const { Branch, Section, Role, UserRole } = require("../Model");
const { where } = require("sequelize");
const { uploadFilesLocally } = require("../middlewares/fileUpload");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 100000000 } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    // جلب المستخدمين مع العلاقات الأساسية فقط
    const users = await User.findAndCountAll({
      include: [
        { 
          model: Branch, 
          as: 'branch', 
          attributes: ['id', 'arabicName'],
          required: false // LEFT JOIN
        },
        { 
          model: Section, 
          as: 'section', 
          attributes: ['id', 'sectionName'],
          required: false // LEFT JOIN
        },
        { 
          model: UserRole, 
          as: 'userRoles', 
          attributes: ['id'],
          required: false, // LEFT JOIN
          include: [
            { 
              model: Role, 
              as: 'role', 
              attributes: ['id', 'roleName'],
              required: false // LEFT JOIN
            }
          ]
        },
      ],
      attributes: { 
        exclude: ["password"] 
      },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    // Transform data to match frontend expectations
    const transformedUsers = users.rows.map(user => {
      const userData = user.toJSON();
      return {
        id: userData.id,
        name: userData.arabicName,
        nameEn: userData.englinshName,
        email: userData.email,
        phone: userData.phoneNumber,
        mobile: userData.telephoneNumber,
        nationalId: userData.ssNumber,
        role: userData.userRoles?.[0]?.role?.roleName || 'بدون دور',
        department: userData.section?.sectionName || 'بدون قسم',
        branch: userData.branch?.arabicName || 'بدون فرع',
        position: '',
        supervisor: '',
        hireDate: userData.startDate,
        salary: userData.salary,
        status: userData.active ? 'active' : 'inactive',
        lastLogin: 'لم يسجل دخول بعد',
        address: {
          country: userData.country || '',
          city: userData.city || '',
          district: userData.nighborhood || '',
          street: userData.street || '',
          postalCode: userData.postalCode || ''
        },
        emergency: {
          name: userData.emergencyContactName || '',
          phone: userData.emergencyContactPhone || '',
          relation: userData.emergencyContactRelation || ''
        }
      };
    });

    res.status(200).json({
      status: "succeed",
      data: transformedUsers,
      totalCount: users.count,
      totalPages: Math.ceil(users.count / limit),
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return next(new AppError(`Database error: ${error.message}`, 400));
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id, {
      include: [
        { 
          model: Branch, 
          as: 'branch', 
          attributes: ['id', 'arabicName'],
          required: false
        },
        { 
          model: Section, 
          as: 'section', 
          attributes: ['id', 'sectionName'],
          required: false
        },
        { 
          model: UserRole, 
          as: 'userRoles', 
          attributes: ['id'],
          required: false,
          include: [
            { 
              model: Role, 
              as: 'role', 
              attributes: ['id', 'roleName'],
              required: false
            }
          ]
        },
      ],
      attributes: { 
        exclude: ["password"] 
      }
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Transform data to match frontend expectations
    const userData = user.toJSON();
    const transformedUser = {
      id: userData.id,
      name: userData.arabicName,
      nameEn: userData.englinshName,
      email: userData.email,
      phone: userData.phoneNumber,
      mobile: userData.telephoneNumber,
      nationalId: userData.ssNumber,
      role: userData.userRoles?.[0]?.role?.roleName || 'بدون دور',
      department: userData.section?.sectionName || 'بدون قسم',
      branch: userData.branch?.arabicName || 'بدون فرع',
      position: '',
      supervisor: '',
      hireDate: userData.startDate,
      salary: userData.salary,
      status: userData.active ? 'active' : 'inactive',
      lastLogin: 'لم يسجل دخول بعد',
      address: {
        country: userData.country || '',
        city: userData.city || '',
        district: userData.nighborhood || '',
        street: userData.street || '',
        postalCode: userData.postalCode || ''
      },
      emergency: {
        name: userData.emergencyContactName || '',
        phone: userData.emergencyContactPhone || '',
        relation: userData.emergencyContactRelation || ''
      }
    };

    res.status(200).json({
      status: "success",
      data: transformedUser
    });
  } catch (error) {
    console.error('Error in getUser:', error);
    return next(new AppError(`Database error: ${error.message}`, 400));
  }
});

// ! not working yet

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  // Find user first
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prepare data for update
  const dataToUpdate = {};

  // Map frontend fields to database fields
  if (updateData.name) dataToUpdate.arabicName = updateData.name;
  if (updateData.nameEn) dataToUpdate.englinshName = updateData.nameEn;
  if (updateData.email) dataToUpdate.email = updateData.email;
  if (updateData.phone) dataToUpdate.phoneNumber = updateData.phone;
  if (updateData.mobile) dataToUpdate.telephoneNumber = updateData.mobile;
  if (updateData.nationalId) dataToUpdate.ssNumber = updateData.nationalId;
  if (updateData.hireDate) dataToUpdate.startDate = updateData.hireDate;
  if (updateData.salary !== undefined) dataToUpdate.salary = updateData.salary;
  if (updateData.status) dataToUpdate.active = updateData.status === 'active';

  // Address fields
  if (updateData.address) {
    if (updateData.address.country) dataToUpdate.country = updateData.address.country;
    if (updateData.address.city) dataToUpdate.city = updateData.address.city;
    if (updateData.address.district) dataToUpdate.nighborhood = updateData.address.district;
    if (updateData.address.street) dataToUpdate.street = updateData.address.street;
    if (updateData.address.postalCode) dataToUpdate.postalCode = updateData.address.postalCode;
  }

  // Emergency contact fields
  if (updateData.emergency) {
    if (updateData.emergency.name) dataToUpdate.emergencyContactName = updateData.emergency.name;
    if (updateData.emergency.phone) dataToUpdate.emergencyContactPhone = updateData.emergency.phone;
    if (updateData.emergency.relation) dataToUpdate.emergencyContactRelation = updateData.emergency.relation;
  }

  // Update user
  await user.update(dataToUpdate);

  // If password is provided, update it (will be hashed by model hooks)
  if (updateData.password && updateData.password.trim() !== '') {
    await user.update({ password: updateData.password });
  }

  // Get updated user with relations
  const updatedUser = await User.findByPk(id, {
    include: [
      { 
        model: Branch, 
        as: 'branch', 
        attributes: ['id', 'arabicName'],
        required: false
      },
      { 
        model: Section, 
        as: 'section', 
        attributes: ['id', 'sectionName'],
        required: false
      },
      { 
        model: UserRole, 
        as: 'userRoles', 
        attributes: ['id'],
        required: false,
        include: [
          { 
            model: Role, 
            as: 'role', 
            attributes: ['id', 'roleName'],
            required: false
          }
        ]
      },
    ],
    attributes: { 
      exclude: ["password"] 
    }
  });

  // Transform response to match frontend expectations
  const transformedUser = {
    id: updatedUser.id,
    name: updatedUser.arabicName,
    nameEn: updatedUser.englinshName,
    email: updatedUser.email,
    phone: updatedUser.phoneNumber,
    mobile: updatedUser.telephoneNumber,
    nationalId: updatedUser.ssNumber,
    role: updatedUser.userRoles?.[0]?.role?.roleName || 'بدون دور',
    department: updatedUser.section?.sectionName || 'بدون قسم',
    branch: updatedUser.branch?.arabicName || 'بدون فرع',
    position: '',
    supervisor: '',
    hireDate: updatedUser.startDate,
    salary: updatedUser.salary,
    status: updatedUser.active ? 'active' : 'inactive',
    lastLogin: 'لم يسجل دخول بعد',
    address: {
      country: updatedUser.country || '',
      city: updatedUser.city || '',
      district: updatedUser.nighborhood || '',
      street: updatedUser.street || '',
      postalCode: updatedUser.postalCode || ''
    },
    emergency: {
      name: updatedUser.emergencyContactName || '',
      phone: updatedUser.emergencyContactPhone || '',
      relation: updatedUser.emergencyContactRelation || ''
    }
  };

  res.status(200).json({
    status: "success",
    data: transformedUser,
    message: "User updated successfully"
  });
});

exports.deleteUser = deleteOne(User);

exports.updateMyData = catchAsync(async (req, res, next) => {
  // TODO 1) check if user want change password

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('if you want to change password go to "/updatepassword" ', 400));

    return next(new AppError('if you want to change password go to "/updatepassword" ', 400));
  }

  // TODO 2) check if user want to change it's role  which isn't his responsability

  if (req.body.role) {
    return next(new AppError("you don't have permession to change your role ", 403));
  }

  // TODO 3) update user data

  const { _id } = req.user;
  const { name, email } = req.body;

  const user = await User.findByPk(_id);
  
  if (!user) {
    return next(new AppError("user doesn't exist or input data is invalid ", 404));
  }

  await user.update({ name, email });
  
  const updatedUser = user.toJSON();
  delete updatedUser.password;

  res.status(200).json({
    status: "succeed",
    updatedUser,
  });
});

exports.deActivateUser = catchAsync(async (req, res, next) => {
  // TODO 1) get user id from
  const { _id } = req.user;

  const user = await User.findByPk(_id);
  
  if (!user) {
    return next(new AppError("user doesn't exist or input data is invalid ", 404));
  }
  
  await user.update({ active: false });
  
  res.status(204).json({
    status: "succeed",
    data: null,
  });
});

exports.CreateUser = catchAsync(async (req, res, next) => {
  try {
    // التحقق من البيانات المطلوبة الأساسية فقط
    const { name, nameEn, email, password, nationalId, phone, mobile } = req.body;
    
    // فحص البيانات المطلوبة
    if (!name || !name.trim()) {
      return next(new AppError("الاسم العربي مطلوب", 400));
    }
    if (!email || !email.trim()) {
      return next(new AppError("البريد الإلكتروني مطلوب", 400));
    }
    if (!password || !password.trim()) {
      return next(new AppError("كلمة المرور مطلوبة", 400));
    }
    if (password.length < 6) {
      return next(new AppError("كلمة المرور يجب أن تكون على الأقل 6 أحرف", 400));
    }
    if (!nationalId || !nationalId.trim()) {
      return next(new AppError("رقم الهوية الوطنية مطلوب", 400));
    }
    if (!phone || !phone.trim()) {
      return next(new AppError("رقم الهاتف مطلوب", 400));
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("البريد الإلكتروني غير صحيح", 400));
    }
    
    // التحقق من أن البريد الإلكتروني ورقم الهوية الوطنية غير مستخدمين
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return next(new AppError("البريد الإلكتروني مستخدم بالفعل", 400));
    }
    
    const existingUserByNationalId = await User.findOne({ where: { ssNumber: nationalId } });
    if (existingUserByNationalId) {
      return next(new AppError("رقم الهوية الوطنية مستخدم بالفعل", 400));
    }

    // Handle uploaded files (اختياري)
    const userFileFields = [
      "profilePicture",
      "idCardPicture",
      "resume",
      "certificates",
      "contract",
      "anotherAttachments",
    ];
    
    let uploadedFiles = [];
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        uploadedFiles = await uploadFilesLocally(req.files, userFileFields);
      } catch (fileError) {
        console.error('Error processing files:', fileError);
        uploadedFiles = [];
      }
    }
    
    // Prepare user data - الحقول الأساسية فقط
    const userData = {
      arabicName: name.trim(),
      englinshName: nameEn ? nameEn.trim() : null,
      ssNumber: nationalId.trim(),
      email: email.trim(),
      password: password,
      phoneNumber: phone.trim(),
      telephoneNumber: mobile ? mobile.trim() : null,
      active: true,
    };
    
    // إضافة branchId فقط إذا كان محدداً (لتجنب مشكلة NOT NULL في قاعدة البيانات)
    // إذا لم يكن محدداً، لا نضيفه إلى userData حتى لا يرسل Sequelize null
    if (req.body.branch || req.body.branchId) {
      userData.branchId = req.body.branch || req.body.branchId;
    }
    
    // إضافة sectionId فقط إذا كان محدداً
    if (req.body.department || req.body.sectionId) {
      userData.sectionId = req.body.department || req.body.sectionId;
    }
    
    // Add uploaded files if any
    uploadedFiles.forEach((file) => {
      userData[file.fieldName] = file.link;
    });

    console.log('Processed user data:', { ...userData, password: '***' });

    // Create user
    const newUser = await User.create(userData);

    if (!newUser) {
      return next(new AppError("فشل في إنشاء المستخدم", 400));
    }
    
    // Role is optional - لا يتم إنشاء UserRole إذا لم يتم تحديد role
    let userRole = null;
    if (req.body.role) {
      const roleData = await Role.findOne({
        where: { roleName: req.body.role },
      });

      if (roleData) {
        userRole = await UserRole.create({
          userId: newUser.id,
          roleId: roleData.id,
        });
      }
    }
    
    res.status(201).json({
      status: "succeed",
      message: "تم إنشاء المستخدم بنجاح",
      data: {
        user: newUser,
        userRole: userRole
      }
    });
    
  } catch (error) {
    console.error('Error in CreateUser:', error);
    return next(new AppError(`فشل في إنشاء المستخدم: ${error.message}`, 500));
  }
});

// Get current user permissions
exports.getCurrentUserPermissions = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user roles
    const userRoles = await UserRole.findAll({
      where: { userId: parseInt(userId) },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'roleName']
        }
      ]
    });

    if (!userRoles || userRoles.length === 0) {
      return res.status(200).json({
        status: "success",
        data: []
      });
    }

    // Return basic role information for now
    // TODO: Implement full permissions system when Page and Permission models are available
    const result = userRoles.map(ur => ({
      id: ur.role.id,
      roleName: ur.role.roleName,
      permissions: ['view'] // Basic permission for now
    }));

    res.status(200).json({
      status: "success",
      data: result
    });
  } catch (error) {
    console.error("Error fetching current user permissions:", error);
    return next(new Error("Error fetching current user permissions: " + error.message));
  }
});

// Update user account (username and password)
exports.updateUserAccount = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    // Validate input
    if (!username && !password) {
      return next(new AppError("Username or password is required", 400));
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Update username if provided
    if (username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({
        where: { 
          email: username, // Using email as username
          id: { [require('sequelize').Op.ne]: id } // Exclude current user
        }
      });
      
      if (existingUser) {
        return next(new AppError("Username already exists", 400));
      }
      
      user.email = username;
    }

    // Update password if provided
    if (password) {
      // Password will be automatically hashed by the model hook
      user.password = password;
    }

    // Save user
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User account updated successfully",
      data: {
        id: user.id,
        username: user.email,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating user account:', error);
    return next(new AppError(`Failed to update user account: ${error.message}`, 500));
  }
});

// Upload user signature
exports.uploadUserSignature = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return next(new AppError("No signature file provided", 400));
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Update user with signature file path
    // Note: You might want to store this in a separate table or field
    // For now, we'll store it in the profilePicture field
    user.profilePicture = req.file.path;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User signature uploaded successfully",
      data: {
        id: user.id,
        signaturePath: req.file.path
      }
    });

  } catch (error) {
    console.error('Error uploading user signature:', error);
    return next(new AppError(`Failed to upload signature: ${error.message}`, 500));
  }
});

// Get user permissions
exports.getUserPermissions = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Get user roles
    const userRoles = await UserRole.findAll({
      where: { userId: parseInt(id) },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'roleName']
        }
      ]
    });

    res.status(200).json({
      status: "success",
      data: {
        userId: id,
        roles: userRoles.map(ur => ur.role)
      }
    });

  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return next(new AppError(`Failed to fetch user permissions: ${error.message}`, 500));
  }
});

// Update user permissions
exports.updateUserPermissions = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // TODO: Implement permission update logic
    // This would typically involve updating RolePagePermission table

    res.status(200).json({
      status: "success",
      message: "User permissions updated successfully"
    });

  } catch (error) {
    console.error('Error updating user permissions:', error);
    return next(new AppError(`Failed to update user permissions: ${error.message}`, 500));
  }
});

// Get user modules
exports.getUserModules = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // TODO: Implement module fetching logic
    // This would typically involve fetching from a modules table

    res.status(200).json({
      status: "success",
      data: {
        userId: id,
        modules: []
      }
    });

  } catch (error) {
    console.error('Error fetching user modules:', error);
    return next(new AppError(`Failed to fetch user modules: ${error.message}`, 500));
  }
});

// Update user modules
exports.updateUserModules = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { modules } = req.body;

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // TODO: Implement module update logic
    // This would typically involve updating a user_modules table

    res.status(200).json({
      status: "success",
      message: "User modules updated successfully"
    });

  } catch (error) {
    console.error('Error updating user modules:', error);
    return next(new AppError(`Failed to update user modules: ${error.message}`, 500));
  }
});

// Toggle user status
exports.toggleUserStatus = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return next(new AppError("Invalid status. Must be 'active' or 'inactive'", 400));
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Update status
    user.active = status === 'active';
    await user.save();

    res.status(200).json({
      status: "success",
      message: `User status updated to ${status}`,
      data: {
        id: user.id,
        status: user.active ? 'active' : 'inactive'
      }
    });

  } catch (error) {
    console.error('Error toggling user status:', error);
    return next(new AppError(`Failed to toggle user status: ${error.message}`, 500));
  }
});

// Update user roles
exports.updateUserRoles = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return next(new AppError("Roles array is required and must not be empty", 400));
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Validate that all roles exist
    const roleIds = roles.map(roleId => parseInt(roleId));
    const existingRoles = await Role.findAll({
      where: { id: roleIds }
    });

    if (existingRoles.length !== roleIds.length) {
      return next(new AppError("One or more roles not found", 404));
    }

    // Delete existing user roles
    await UserRole.destroy({
      where: { userId: parseInt(id) }
    });

    // Create new user roles
    const userRoles = await UserRole.bulkCreate(
      roleIds.map(roleId => ({
        userId: parseInt(id),
        roleId: roleId
      }))
    );

    // Get updated user with roles
    const updatedUser = await User.findByPk(id, {
      include: [
        { 
          model: Branch, 
          as: 'branch', 
          attributes: ['id', 'arabicName'],
          required: false
        },
        { 
          model: Section, 
          as: 'section', 
          attributes: ['id', 'sectionName'],
          required: false
        },
        { 
          model: UserRole, 
          as: 'userRoles', 
          attributes: ['id'],
          required: false,
          include: [
            { 
              model: Role, 
              as: 'role', 
              attributes: ['id', 'roleName'],
              required: false
            }
          ]
        },
      ],
      attributes: { 
        exclude: ["password"] 
      }
    });

    res.status(200).json({
      status: "success",
      message: "User roles updated successfully",
      data: {
        userId: id,
        roles: updatedUser.userRoles?.map(ur => ({
          id: ur.role.id,
          roleName: ur.role.roleName
        })) || []
      }
    });

  } catch (error) {
    console.error('Error updating user roles:', error);
    return next(new AppError(`Failed to update user roles: ${error.message}`, 500));
  }
});
