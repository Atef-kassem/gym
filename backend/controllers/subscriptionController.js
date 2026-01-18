const { GymSubscription, Branch, Employee } = require("../Model/index");
const { Op } = require("sequelize");

// Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { search, branchId, subscriptionType, status, isSpecial } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { subscriptionNumber: { [Op.like]: `%${search}%` } },
        { receiptNumber: { [Op.like]: `%${search}%` } },
      ];
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (subscriptionType) {
      where.subscriptionType = subscriptionType;
    }
    if (status) {
      where.status = status;
    } else {
      // Calculate status based on dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // We'll filter in memory or use a more complex query
    }

    // معالجة isSpecial مع معالجة الخطأ في حالة عدم وجود العمود
    if (typeof isSpecial !== "undefined" && isSpecial !== null && isSpecial !== "") {
      if (isSpecial === "false" || isSpecial === false) {
        where.isSpecial = false;
      } else if (isSpecial === "true" || isSpecial === true) {
        where.isSpecial = true;
    }
    }

    let subscriptions;
    try {
      subscriptions = await GymSubscription.findAll({
        where,
        include: [
          { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
          { model: Employee, as: "employee", attributes: ["id", "arabicName", "englishName", "employeeCode"] },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (dbError) {
      // إذا كان الخطأ بسبب عدم وجود العمود isSpecial، نعيد المحاولة بدون الفلتر
      if (dbError.name === 'SequelizeDatabaseError' && dbError.original && dbError.original.sqlMessage && dbError.original.sqlMessage.includes('isSpecial')) {
        console.warn("isSpecial column does not exist in database, ignoring filter");
        delete where.isSpecial;
        subscriptions = await GymSubscription.findAll({
      where,
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: Employee, as: "employee", attributes: ["id", "arabicName", "englishName", "employeeCode"] },
      ],
      order: [["createdAt", "DESC"]],
    });
      } else {
        throw dbError; // إذا كان الخطأ لأسباب أخرى، نرميه
      }
    }

    // Calculate status if not provided
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const subscriptionsWithStatus = subscriptions.map(sub => {
      const startDate = new Date(sub.subscriptionStartDate);
      const endDate = new Date(sub.subscriptionEndDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      let status = sub.status;
      if (today < startDate) {
        status = "upcoming";
      } else if (today > endDate) {
        status = "expired";
      } else {
        status = "active";
      }
      
      return { ...sub.toJSON(), status };
    });

    res.json({
      success: true,
      data: subscriptionsWithStatus,
      count: subscriptionsWithStatus.length,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscriptions",
      error: error.message,
    });
  }
};

// Get subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await GymSubscription.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "employee" },
      ],
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription",
      error: error.message,
    });
  }
};

// Create subscription
exports.createSubscription = async (req, res) => {
  try {
    console.log('📥 بيانات الاشتراك المستلمة:', req.body);

    // تحضير البيانات
    let subscriptionData = { ...req.body };

    // Set registrationDate to today if not provided (required field)
    if (!subscriptionData.registrationDate || subscriptionData.registrationDate === "") {
      subscriptionData.registrationDate = new Date().toISOString().split('T')[0];
    }

    // تحويل الحقول الفارغة إلى null للحقول الاختيارية
    if (subscriptionData.subscriptionStartDate === "" || subscriptionData.subscriptionStartDate === null) subscriptionData.subscriptionStartDate = null;
    if (subscriptionData.subscriptionEndDate === "" || subscriptionData.subscriptionEndDate === null) subscriptionData.subscriptionEndDate = null;
    if (subscriptionData.receiptNumber === "" || subscriptionData.receiptNumber === null) subscriptionData.receiptNumber = null;
    if (subscriptionData.employeeId === "" || subscriptionData.employeeId === null || subscriptionData.employeeId === "null") subscriptionData.employeeId = null;
    if (subscriptionData.customerName === "" || subscriptionData.customerName === null) subscriptionData.customerName = null;
    
    // Convert subscriptionValue, discountValue, paidAmount to numbers
    if (subscriptionData.subscriptionValue) subscriptionData.subscriptionValue = parseFloat(subscriptionData.subscriptionValue) || 0;
    if (subscriptionData.discountValue) subscriptionData.discountValue = parseFloat(subscriptionData.discountValue) || 0;
    if (subscriptionData.paidAmount) subscriptionData.paidAmount = parseFloat(subscriptionData.paidAmount) || 0;

    // تحويل الأرقام
    if (subscriptionData.branchId) subscriptionData.branchId = parseInt(subscriptionData.branchId);
    if (subscriptionData.employeeId) subscriptionData.employeeId = parseInt(subscriptionData.employeeId);
    
    // Generate subscription number if not provided
    if (!subscriptionData.subscriptionNumber) {
      const lastGymSubscription = await GymSubscription.findOne({
        order: [["id", "DESC"]],
      });
      const nextId = lastGymSubscription ? lastGymSubscription.id + 1 : 1;
      subscriptionData.subscriptionNumber = `SUB${String(nextId).padStart(6, "0")}`;
    }

    // Validate required fields
    if (!subscriptionData.branchId || !subscriptionData.customerName || !subscriptionData.subscriptionStartDate || !subscriptionData.subscriptionEndDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: branchId, customerName, subscriptionStartDate, and subscriptionEndDate are required",
      });
    }

    // Flag to تمييز الاشتراكات الخاصة عن العادية
    if (typeof subscriptionData.isSpecial === "undefined" || subscriptionData.isSpecial === null) {
      subscriptionData.isSpecial = false;
    } else {
      subscriptionData.isSpecial = subscriptionData.isSpecial === true || subscriptionData.isSpecial === "true";
    }

    // Calculate remaining amount
    const subscriptionValue = parseFloat(subscriptionData.subscriptionValue) || 0;
    const discountValue = subscriptionData.discountEnabled ? (parseFloat(subscriptionData.discountValue) || 0) : 0;
    const paidAmount = parseFloat(subscriptionData.paidAmount) || 0;
    subscriptionData.remainingAmount = subscriptionValue - discountValue - paidAmount;

    // Calculate status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(subscriptionData.subscriptionStartDate);
    const endDate = new Date(subscriptionData.subscriptionEndDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    if (today < startDate) {
      subscriptionData.status = "upcoming";
    } else if (today > endDate) {
      subscriptionData.status = "expired";
    } else {
      subscriptionData.status = "active";
    }

    console.log('📝 بيانات الاشتراك بعد المعالجة:', subscriptionData);
    console.log('💾 محاولة إنشاء الاشتراك في قاعدة البيانات...');
    
    const subscription = await GymSubscription.create(subscriptionData);
    
    const subscriptionWithRelations = await GymSubscription.findByPk(subscription.id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "employee" },
      ],
    });

    // إنشاء إشعار تلقائي للعضو عند إنشاء اشتراك جديد
    const { createNotification } = require("./appManagementController");
    if (subscription.memberId) {
      await createNotification({
        notificationType: "subscription",
        receiverId: subscription.memberId,
        receiverType: "member",
        title: "اشتراك جديد",
        content: `تم إنشاء اشتراك جديد لك في ${subscriptionWithRelations.branch?.name || "الصالة"}`,
        relatedItemId: subscription.id,
        relatedItemType: "GymSubscription",
        priority: "normal",
      });
    }

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscriptionWithRelations,
    });
  } catch (error) {
    console.error("❌ Error creating subscription:", error);
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
        message: `Invalid reference: The selected branch or employee does not exist`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating subscription",
      error: error.message,
    });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await GymSubscription.findByPk(id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Recalculate remaining amount if values changed
    if (req.body.subscriptionValue !== undefined || req.body.discountValue !== undefined || req.body.paidAmount !== undefined) {
      const subscriptionValue = parseFloat(req.body.subscriptionValue || subscription.subscriptionValue) || 0;
      const discountValue = req.body.discountEnabled ? (parseFloat(req.body.discountValue || subscription.discountValue) || 0) : 0;
      const paidAmount = parseFloat(req.body.paidAmount || subscription.paidAmount) || 0;
      req.body.remainingAmount = subscriptionValue - discountValue - paidAmount;
    }

    // Recalculate status if dates changed
    if (req.body.subscriptionStartDate || req.body.subscriptionEndDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(req.body.subscriptionStartDate || subscription.subscriptionStartDate);
      const endDate = new Date(req.body.subscriptionEndDate || subscription.subscriptionEndDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      if (today < startDate) {
        req.body.status = "upcoming";
      } else if (today > endDate) {
        req.body.status = "expired";
      } else {
        req.body.status = "active";
      }
    }

    await subscription.update(req.body);
    
    const subscriptionWithRelations = await GymSubscription.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "employee" },
      ],
    });

    res.json({
      success: true,
      message: "Subscription updated successfully",
      data: subscriptionWithRelations,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error updating subscription",
      error: error.message,
    });
  }
};

// Delete subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await GymSubscription.findByPk(id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    await subscription.destroy();

    res.json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting subscription",
      error: error.message,
    });
  }
};

// Get subscription statistics
exports.getSubscriptionStatistics = async (req, res) => {
  try {
    const { isSpecial } = req.query;

    const where = {};
    // معالجة isSpecial فقط إذا كان موجوداً في الـ query
    // إذا كان العمود غير موجود في قاعدة البيانات، سيتم تجاهله تلقائياً في catch
    if (typeof isSpecial !== "undefined" && isSpecial !== null && isSpecial !== "") {
      // معالجة isSpecial بشكل صحيح سواء كانت "true", "false", true, false
      if (isSpecial === "false" || isSpecial === false) {
        where.isSpecial = false;
      } else if (isSpecial === "true" || isSpecial === true) {
        where.isSpecial = true;
    }
    }

    let subscriptions;
    try {
      subscriptions = await GymSubscription.findAll({ where });
    } catch (dbError) {
      // إذا كان الخطأ بسبب عدم وجود العمود isSpecial، نعيد المحاولة بدون الفلتر
      if (dbError.name === 'SequelizeDatabaseError' && dbError.original && dbError.original.sqlMessage && dbError.original.sqlMessage.includes('isSpecial')) {
        console.warn("isSpecial column does not exist in database, ignoring filter");
        delete where.isSpecial;
        subscriptions = await GymSubscription.findAll({ where });
      } else {
        throw dbError; // إذا كان الخطأ لأسباب أخرى، نرميه
      }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = subscriptions.length;
    let active = 0;
    let expired = 0;
    let upcoming = 0;
    let totalValue = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    let monthlyCount = 0;
    let yearlyCount = 0;

    subscriptions.forEach(sub => {
      // التحقق من وجود التواريخ قبل معالجتها
      if (!sub.subscriptionStartDate || !sub.subscriptionEndDate) {
        return; // تخطي هذا الاشتراك إذا لم تكن التواريخ موجودة
      }

      const startDate = new Date(sub.subscriptionStartDate);
      const endDate = new Date(sub.subscriptionEndDate);
      
      // التحقق من صحة التواريخ
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return; // تخطي هذا الاشتراك إذا كانت التواريخ غير صحيحة
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      if (today < startDate) {
        upcoming++;
      } else if (today > endDate) {
        expired++;
      } else {
        active++;
      }

      totalValue += parseFloat(sub.subscriptionValue || 0);
      totalPaid += parseFloat(sub.paidAmount || 0);
      totalRemaining += parseFloat(sub.remainingAmount || 0);

      // Calculate if monthly or yearly (approximately)
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 35) {
        monthlyCount++;
      } else if (daysDiff >= 360) {
        yearlyCount++;
      }
    });

    res.json({
      success: true,
      data: {
        total,
        active,
        expired,
        upcoming,
        totalValue,
        totalPaid,
        totalRemaining,
        monthlyCount,
        yearlyCount,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription statistics",
      error: error.message,
    });
  }
};
