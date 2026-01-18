const { Member, Branch, MembershipType, Employee, User } = require("../Model/index");
const { Op } = require("sequelize");
const { uploadFilesLocally } = require("../middlewares/fileUpload");

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const { search, branchId, status } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { memberCode: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const members = await Member.findAll({
      where,
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: MembershipType, as: "membershipType", attributes: ["id", "name", "price"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: members,
      count: members.length,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching members",
      error: error.message,
    });
  }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: MembershipType, as: "membershipType" },
      ],
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching member",
      error: error.message,
    });
  }
};

// Create member
exports.createMember = async (req, res) => {
  try {
    console.log('📥 بيانات الطلب المستلمة:', {
      body: req.body,
      files: req.files,
      bodyKeys: Object.keys(req.body || {}),
      filesKeys: req.files ? Object.keys(req.files) : []
    });

    // معالجة الملفات المرفوعة
    const memberFileFields = ["profilePicture"];
    let memberData = { ...req.body };
    
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        console.log('📦 الملفات المستلمة للعضو:', req.files);
        const uploadedFiles = await uploadFilesLocally(req.files, memberFileFields);
        console.log('📤 الملفات المرفوعة:', uploadedFiles);
        uploadedFiles.forEach((file) => {
          if (file.fieldName === 'profilePicture') {
            memberData.profilePicture = file.link;
          }
        });
        console.log('✅ تم رفع صورة العضو:', memberData.profilePicture);
      } catch (error) {
        console.error('❌ خطأ في رفع الصورة:', error);
        // لا نوقف العملية إذا فشل رفع الملف
      }
    }

    // تحويل الحقول الفارغة إلى null للحقول الاختيارية
    if (memberData.email === "" || memberData.email === null) memberData.email = null;
    if (memberData.cardNumber === "" || memberData.cardNumber === null) memberData.cardNumber = null;
    if (memberData.address === "" || memberData.address === null) memberData.address = null;
    if (memberData.membershipTypeId === "" || memberData.membershipTypeId === null) memberData.membershipTypeId = null;
    if (memberData.startDate === "" || memberData.startDate === null) memberData.startDate = null;
    if (memberData.endDate === "" || memberData.endDate === null) memberData.endDate = null;
    if (memberData.dateOfBirth === "" || memberData.dateOfBirth === null) memberData.dateOfBirth = null;
    if (memberData.notes === "" || memberData.notes === null) memberData.notes = null;

    // تحويل branchId و membershipTypeId إلى أعداد إذا كانت موجودة
    if (memberData.branchId) memberData.branchId = parseInt(memberData.branchId);
    if (memberData.membershipTypeId) memberData.membershipTypeId = parseInt(memberData.membershipTypeId);

    console.log('📝 بيانات العضو بعد المعالجة:', memberData);

    // Validate phone number
    if (memberData.phone && !/^(010|010)/.test(memberData.phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must start with 010 or 010",
      });
    }

    // Validate required fields
    if (!memberData.branchId || !memberData.name || !memberData.phone || !memberData.gender) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: branchId, name, phone, and gender are required",
      });
    }

    // Generate member code if not provided
    if (!memberData.memberCode || memberData.memberCode === "") {
      const lastMember = await Member.findOne({
        order: [["id", "DESC"]],
      });
      const nextId = lastMember ? lastMember.id + 1 : 1;
      memberData.memberCode = `MEM${String(nextId).padStart(6, "0")}`;
    }

    // Validate email format if provided
    if (memberData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    console.log('💾 محاولة إنشاء العضو في قاعدة البيانات...');
    const member = await Member.create(memberData);
    console.log('✅ تم إنشاء العضو بنجاح:', member.id);
    
    // إنشاء حساب مستخدم تلقائياً للعضو
    try {
      // تنظيف رقم الهاتف بنفس طريقة authController
      let memberPhone = memberData.phone;
      if (memberPhone) {
        memberPhone = memberPhone.trim().replace(/[\s\-\(\)\+]/g, '');
      }
      
      if (!memberPhone) {
        console.log('⚠️ لا يمكن إنشاء حساب مستخدم: لا يوجد phone number');
      } else {
        // إنشاء email فريد من phone number + member id إذا لم يكن موجوداً
        let memberEmail = memberData.email;
        if (!memberEmail) {
          memberEmail = `member${member.id}_${memberPhone}@gym.local`;
        }
        
        // إنشاء ssNumber فريد من memberCode أو member id
        let ssNumber = `MEM${member.memberCode || member.id}`;
        
        // التحقق من عدم وجود مستخدم بنفس email أو ssNumber
        let existingUser = await User.findOne({
          where: {
            [Op.or]: [
              { email: memberEmail },
              { ssNumber: ssNumber }
            ]
          }
        });
        
        // إذا كان email مستخدم، أنشئ email جديد
        if (existingUser && existingUser.email === memberEmail) {
          memberEmail = `member${member.id}_${Date.now()}@gym.local`;
          existingUser = await User.findOne({ where: { email: memberEmail } });
        }
        
        // إذا كان ssNumber مستخدم، أنشئ ssNumber جديد
        if (existingUser && existingUser.ssNumber === ssNumber) {
          ssNumber = `MEM${member.id}_${Date.now()}`;
          existingUser = await User.findOne({ where: { ssNumber: ssNumber } });
        }
        
        if (existingUser) {
          console.log('⚠️ يوجد مستخدم بالفعل بنفس البيانات:', existingUser.id);
        } else {
          // إنشاء حساب مستخدم جديد
          // ملاحظة: لا نستخدم bcrypt.hash هنا لأن User model لديه hook beforeCreate يقوم بالتشفير تلقائياً
          const defaultPassword = "123456";
          
          const userData = {
            arabicName: memberData.name || "عضو",
            englinshName: memberData.name || "Member",
            ssNumber: ssNumber,
            email: memberEmail,
            password: defaultPassword, // سيتم تشفيره تلقائياً في beforeCreate hook
            phoneNumber: memberPhone, // يتم حفظه بعد التنظيف
            branchId: memberData.branchId || 1,
            active: true,
          };
          
          const newUser = await User.create(userData);
          console.log('✅ تم إنشاء حساب مستخدم تلقائياً للعضو:', newUser.id);
          console.log('   📱 Phone:', memberPhone);
          console.log('   📧 Email:', memberEmail);
          console.log('   🔑 كلمة المرور: 123456');
        }
      }
    } catch (userError) {
      // لا نوقف العملية إذا فشل إنشاء حساب المستخدم
      console.error('❌ خطأ في إنشاء حساب المستخدم للعضو:', userError.message);
      // Log full error for debugging
      if (userError.errors) {
        console.error('Validation errors:', userError.errors.map(e => e.message).join(', '));
      }
    }
    
    const memberWithRelations = await Member.findByPk(member.id, {
      include: [
        { model: Branch, as: "branch" },
        { model: MembershipType, as: "membershipType" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: memberWithRelations,
    });
  } catch (error) {
    console.error("❌ Error creating member:", error);
    console.error("❌ Error details:", {
      message: error.message,
      name: error.name,
      errors: error.errors,
      stack: error.stack
    });
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${validationErrors}`,
        errors: error.errors
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: `Duplicate entry: ${error.errors[0]?.message || 'This value already exists'}`,
      });
    }

    // Handle foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: `Invalid reference: The selected branch or membership type does not exist`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating member",
      error: error.message,
    });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    // معالجة الملفات المرفوعة
    const memberFileFields = ["profilePicture"];
    let memberData = { ...req.body };
    
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        console.log('📦 الملفات المستلمة لتحديث العضو:', req.files);
        const uploadedFiles = await uploadFilesLocally(req.files, memberFileFields);
        console.log('📤 الملفات المرفوعة:', uploadedFiles);
        uploadedFiles.forEach((file) => {
          if (file.fieldName === 'profilePicture') {
            memberData.profilePicture = file.link;
          }
        });
        console.log('✅ تم رفع صورة العضو:', memberData.profilePicture);
      } catch (error) {
        console.error('❌ خطأ في رفع الصورة:', error);
        // لا نوقف العملية إذا فشل رفع الملف
      }
    }
    
    // Validate phone number if provided
    if (memberData.phone && !/^(010|010)/.test(memberData.phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must start with 010 or 010",
      });
    }

    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await member.update(memberData);
    
    const memberWithRelations = await Member.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: MembershipType, as: "membershipType" },
      ],
    });

    res.json({
      success: true,
      message: "Member updated successfully",
      data: memberWithRelations,
    });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({
      success: false,
      message: "Error updating member",
      error: error.message,
    });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByPk(id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await member.destroy();

    res.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting member",
      error: error.message,
    });
  }
};

// Get member statistics
exports.getMemberStatistics = async (req, res) => {
  try {
    const total = await Member.count();
    const active = await Member.count({ where: { isActive: true } });
    const inactive = await Member.count({ where: { isActive: false } });

    res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
      },
    });
  } catch (error) {
    console.error("Error fetching member statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching member statistics",
      error: error.message,
    });
  }
};

