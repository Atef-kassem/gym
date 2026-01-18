const {
  AboutApp,
  Invitation,
  AppOffer,
  AppTrainer,
  ExerciseCategory,
  AppExercise,
  AppNews,
  AppAd,
  AppMessage,
  OfferFavorite,
  Employee,
  Branch,
  Member,
} = require("../Model/index");
const { Op } = require("sequelize");
const { uploadFilesLocally } = require("../middlewares/fileUpload");

// ==================== App Media Upload ====================
// رفع صورة عامة لاستخدامها في (العروض / المدربين / التمارين / الأخبار / الإعلانات)
exports.uploadAppImage = async (req, res) => {
  try {
    const uploadedFiles = await uploadFilesLocally(req.files, ["image"]);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "لم يتم استلام أي ملفات",
      });
    }

    const file = uploadedFiles[0];

    return res.status(201).json({
      success: true,
      message: "تم رفع الصورة بنجاح",
      data: {
        fieldName: file.fieldName,
        link: file.link,
      },
    });
  } catch (error) {
    console.error("Error uploading app image:", error);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء رفع الصورة",
      error: error.message,
    });
  }
};

// ==================== About App ====================
exports.getAboutApp = async (req, res) => {
  try {
    let aboutApp = await AboutApp.findOne();
    if (!aboutApp) {
      aboutApp = await AboutApp.create({});
    }
    res.json({ success: true, data: aboutApp });
  } catch (error) {
    console.error("Error fetching about app:", error);
    res.status(500).json({ success: false, message: "Error fetching about app", error: error.message });
  }
};

exports.updateAboutApp = async (req, res) => {
  try {
    let aboutApp = await AboutApp.findOne();
    if (!aboutApp) {
      aboutApp = await AboutApp.create(req.body);
    } else {
      await aboutApp.update(req.body);
    }
    res.json({ success: true, message: "About app updated successfully", data: aboutApp });
  } catch (error) {
    console.error("Error updating about app:", error);
    res.status(500).json({ success: false, message: "Error updating about app", error: error.message });
  }
};

// ==================== Privacy Policy ====================
exports.getPrivacyPolicy = async (req, res) => {
  try {
    let aboutApp = await AboutApp.findOne();
    if (!aboutApp) {
      aboutApp = await AboutApp.create({});
    }
    // إرجاع privacyPolicy فقط
    res.json({ 
      success: true, 
      data: {
        id: aboutApp.id,
        privacyPolicy: aboutApp.privacyPolicy || "",
        termsOfService: aboutApp.termsOfService || "",
        updatedAt: aboutApp.updatedAt,
        createdAt: aboutApp.createdAt,
      }
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    res.status(500).json({ success: false, message: "Error fetching privacy policy", error: error.message });
  }
};

exports.updatePrivacyPolicy = async (req, res) => {
  try {
    let aboutApp = await AboutApp.findOne();
    if (!aboutApp) {
      aboutApp = await AboutApp.create(req.body);
    } else {
      // تحديث privacyPolicy و termsOfService فقط
      await aboutApp.update({
        privacyPolicy: req.body.privacyPolicy || aboutApp.privacyPolicy,
        termsOfService: req.body.termsOfService || aboutApp.termsOfService,
      });
    }
    res.json({ 
      success: true, 
      message: "Privacy policy updated successfully", 
      data: {
        id: aboutApp.id,
        privacyPolicy: aboutApp.privacyPolicy,
        termsOfService: aboutApp.termsOfService,
        updatedAt: aboutApp.updatedAt,
        createdAt: aboutApp.createdAt,
      }
    });
  } catch (error) {
    console.error("Error updating privacy policy:", error);
    res.status(500).json({ success: false, message: "Error updating privacy policy", error: error.message });
  }
};

// ==================== Invitations ====================
exports.getAllInvitations = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { recipientName: { [Op.like]: `%${search}%` } },
        { recipientEmail: { [Op.like]: `%${search}%` } },
        { invitationCode: { [Op.like]: `%${search}%` } },
      ];
    }

    const invitations = await Invitation.findAll({
      where,
      include: [{ model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: invitations, count: invitations.length });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ success: false, message: "Error fetching invitations", error: error.message });
  }
};

exports.createInvitation = async (req, res) => {
  try {
    // Generate invitation code
    if (!req.body.invitationCode) {
      const lastInvitation = await Invitation.findOne({ order: [["id", "DESC"]] });
      const nextId = lastInvitation ? lastInvitation.id + 1 : 1;
      req.body.invitationCode = `INV${String(nextId).padStart(6, "0")}`;
    }

    const invitation = await Invitation.create(req.body);
    res.status(201).json({ success: true, message: "Invitation created successfully", data: invitation });
  } catch (error) {
    console.error("Error creating invitation:", error);
    res.status(500).json({ success: false, message: "Error creating invitation", error: error.message });
  }
};

exports.updateInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const invitation = await Invitation.findByPk(id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: "Invitation not found" });
    }

    // Update dates based on status
    if (req.body.status === "accepted" && !req.body.acceptedDate) {
      req.body.acceptedDate = new Date();
    }
    if (req.body.status === "rejected" && !req.body.rejectedDate) {
      req.body.rejectedDate = new Date();
    }
    if (req.body.status === "attended" && !req.body.attendanceDate) {
      req.body.attendanceDate = new Date();
    }

    await invitation.update(req.body);
    res.json({ success: true, message: "Invitation updated successfully", data: invitation });
  } catch (error) {
    console.error("Error updating invitation:", error);
    res.status(500).json({ success: false, message: "Error updating invitation", error: error.message });
  }
};

// Get invitations by status
exports.getInvitationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const invitations = await Invitation.findAll({
      where: { status },
      include: [{ model: Branch, as: "branch" }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: invitations });
  } catch (error) {
    console.error("Error fetching invitations by status:", error);
    res.status(500).json({ success: false, message: "Error fetching invitations", error: error.message });
  }
};

// ==================== App Offers ====================
exports.getAllOffers = async (req, res) => {
  try {
    const { search, isActive, memberId } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const offers = await AppOffer.findAll({ where, order: [["createdAt", "DESC"]] });
    
    // إذا كان memberId موجوداً، أضف معلومات المفضلة لكل عرض
    if (memberId) {
      const memberIdInt = parseInt(memberId);
      const favoriteOffers = await OfferFavorite.findAll({
        where: { memberId: memberIdInt },
      });
      
      const favoriteOfferIds = new Set(favoriteOffers.map(fav => fav.offerId));
      
      // إضافة checkFav لكل عرض
      const offersWithFav = offers.map(offer => {
        const offerData = offer.toJSON();
        offerData.checkFav = favoriteOfferIds.has(offer.id) ? "in_fav" : null;
        return offerData;
      });
      
      return res.json({ success: true, data: offersWithFav, count: offersWithFav.length });
    }
    
    res.json({ success: true, data: offers, count: offers.length });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, message: "Error fetching offers", error: error.message });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const offer = await AppOffer.create(req.body);
    
    // إنشاء إشعار تلقائي لجميع الأعضاء عند إضافة عرض جديد
    if (offer.isActive) {
      await createNotificationForAllMembers({
        notificationType: "offer",
        title: `عرض جديد: ${offer.title}`,
        content: offer.description 
          ? (offer.description.substring(0, 200) + (offer.description.length > 200 ? "..." : ""))
          : `خصم ${offer.discount}% - ${offer.title}`,
        relatedItemId: offer.id,
        relatedItemType: "AppOffer",
        imageUrl: offer.imageUrl,
        priority: "high",
      });
    }
    
    res.status(201).json({ success: true, message: "Offer created successfully", data: offer });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ success: false, message: "Error creating offer", error: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await AppOffer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    await offer.update(req.body);
    res.json({ success: true, message: "Offer updated successfully", data: offer });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ success: false, message: "Error updating offer", error: error.message });
  }
};

exports.toggleOfferFavorite = async (req, res) => {
  try {
    const { offerId, memberId } = req.body;

    if (!offerId || !memberId) {
      return res.status(400).json({
        success: false,
        message: "offerId and memberId are required",
      });
    }

    // التحقق من وجود العرض
    const offer = await AppOffer.findByPk(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // التحقق من وجود العضو
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // البحث عن المفضلة الموجودة
    const existingFavorite = await OfferFavorite.findOne({
      where: {
        offerId: parseInt(offerId),
        memberId: parseInt(memberId),
      },
    });

    if (existingFavorite) {
      // إذا كانت موجودة، احذفها (إزالة من المفضلة)
      await existingFavorite.destroy();
      return res.json({
        success: true,
        message: "Offer removed from favorites",
        data: { isFavorite: false },
      });
    } else {
      // إذا لم تكن موجودة، أضفها (إضافة إلى المفضلة)
      const favorite = await OfferFavorite.create({
        offerId: parseInt(offerId),
        memberId: parseInt(memberId),
      });
      return res.json({
        success: true,
        message: "Offer added to favorites",
        data: { isFavorite: true, favorite },
      });
    }
  } catch (error) {
    console.error("Error toggling offer favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling offer favorite",
      error: error.message,
    });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await AppOffer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    await offer.destroy();
    res.json({ success: true, message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ success: false, message: "Error deleting offer", error: error.message });
  }
};

// ==================== App Trainers ====================
exports.getAllTrainers = async (req, res) => {
  try {
    const { search, isActive } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { specialization: { [Op.like]: `%${search}%` } },
      ];
    }
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const trainers = await AppTrainer.findAll({
      where,
      include: [{ model: Employee, as: "employee", attributes: ["id", "arabicName", "englishName"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: trainers, count: trainers.length });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ success: false, message: "Error fetching trainers", error: error.message });
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const trainer = await AppTrainer.create(req.body);
    const trainerWithRelations = await AppTrainer.findByPk(trainer.id, {
      include: [{ model: Employee, as: "employee" }],
    });
    res.status(201).json({ success: true, message: "Trainer created successfully", data: trainerWithRelations });
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(500).json({ success: false, message: "Error creating trainer", error: error.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await AppTrainer.findByPk(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    await trainer.update(req.body);
    const trainerWithRelations = await AppTrainer.findByPk(id, {
      include: [{ model: Employee, as: "employee" }],
    });
    res.json({ success: true, message: "Trainer updated successfully", data: trainerWithRelations });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ success: false, message: "Error updating trainer", error: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await AppTrainer.findByPk(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    await trainer.destroy();
    res.json({ success: true, message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ success: false, message: "Error deleting trainer", error: error.message });
  }
};

// ==================== Exercise Categories ====================
exports.getAllExerciseCategories = async (req, res) => {
  try {
    const categories = await ExerciseCategory.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching exercise categories:", error);
    res.status(500).json({ success: false, message: "Error fetching exercise categories", error: error.message });
  }
};

exports.createExerciseCategory = async (req, res) => {
  try {
    const category = await ExerciseCategory.create(req.body);
    res.status(201).json({ success: true, message: "Exercise category created successfully", data: category });
  } catch (error) {
    console.error("Error creating exercise category:", error);
    res.status(500).json({ success: false, message: "Error creating exercise category", error: error.message });
  }
};

exports.updateExerciseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ExerciseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Exercise category not found" });
    }
    await category.update(req.body);
    res.json({ success: true, message: "Exercise category updated successfully", data: category });
  } catch (error) {
    console.error("Error updating exercise category:", error);
    res.status(500).json({ success: false, message: "Error updating exercise category", error: error.message });
  }
};

exports.deleteExerciseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ExerciseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Exercise category not found" });
    }
    await category.destroy();
    res.json({ success: true, message: "Exercise category deleted successfully" });
  } catch (error) {
    console.error("Error deleting exercise category:", error);
    res.status(500).json({ success: false, message: "Error deleting exercise category", error: error.message });
  }
};

// ==================== App Exercises ====================
exports.getAllExercises = async (req, res) => {
  try {
    const { search, categoryId } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const exercises = await AppExercise.findAll({
      where,
      include: [{ model: ExerciseCategory, as: "category", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: exercises, count: exercises.length });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ success: false, message: "Error fetching exercises", error: error.message });
  }
};

exports.createExercise = async (req, res) => {
  try {
    const exercise = await AppExercise.create(req.body);
    const exerciseWithCategory = await AppExercise.findByPk(exercise.id, {
      include: [{ model: ExerciseCategory, as: "category" }],
    });
    res.status(201).json({ success: true, message: "Exercise created successfully", data: exerciseWithCategory });
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ success: false, message: "Error creating exercise", error: error.message });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await AppExercise.findByPk(id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }
    await exercise.update(req.body);
    const exerciseWithCategory = await AppExercise.findByPk(id, {
      include: [{ model: ExerciseCategory, as: "category" }],
    });
    res.json({ success: true, message: "Exercise updated successfully", data: exerciseWithCategory });
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ success: false, message: "Error updating exercise", error: error.message });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await AppExercise.findByPk(id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }
    await exercise.destroy();
    res.json({ success: true, message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ success: false, message: "Error deleting exercise", error: error.message });
  }
};

// ==================== App News ====================
exports.getAllNews = async (req, res) => {
  try {
    const { search, isPublished } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }
    if (isPublished !== undefined) {
      where.isPublished = isPublished === "true";
    }

    const news = await AppNews.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: news, count: news.length });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ success: false, message: "Error fetching news", error: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const news = await AppNews.create(req.body);
    
    // إنشاء إشعار تلقائي لجميع الأعضاء عند إضافة خبر جديد
    if (news.isPublished) {
      await createNotificationForAllMembers({
        notificationType: "news",
        title: `خبر جديد: ${news.title}`,
        content: news.content.substring(0, 200) + (news.content.length > 200 ? "..." : ""),
        relatedItemId: news.id,
        relatedItemType: "AppNews",
        imageUrl: news.imageUrl,
        priority: "normal",
      });
    }
    
    res.status(201).json({ success: true, message: "News created successfully", data: news });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ success: false, message: "Error creating news", error: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await AppNews.findByPk(id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    await news.update(req.body);
    res.json({ success: true, message: "News updated successfully", data: news });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ success: false, message: "Error updating news", error: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await AppNews.findByPk(id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    await news.destroy();
    res.json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ success: false, message: "Error deleting news", error: error.message });
  }
};

// ==================== App Ads ====================
exports.getAllAds = async (req, res) => {
  try {
    const { search, isActive } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const ads = await AppAd.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: ads, count: ads.length });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ success: false, message: "Error fetching ads", error: error.message });
  }
};

exports.createAd = async (req, res) => {
  try {
    const ad = await AppAd.create(req.body);
    res.status(201).json({ success: true, message: "Ad created successfully", data: ad });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({ success: false, message: "Error creating ad", error: error.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await AppAd.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }
    await ad.update(req.body);
    res.json({ success: true, message: "Ad updated successfully", data: ad });
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ success: false, message: "Error updating ad", error: error.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await AppAd.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }
    await ad.destroy();
    res.json({ success: true, message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ success: false, message: "Error deleting ad", error: error.message });
  }
};

// ==================== App Notifications (Messages) ====================
// دالة مساعدة لإنشاء إشعار تلقائي
const createNotification = async (notificationData) => {
  try {
    const {
      notificationType,
      receiverId,
      receiverType = "member",
      title,
      content,
      relatedItemId,
      relatedItemType,
      imageUrl,
      priority = "normal",
    } = notificationData;

    if (!title || !content) {
      console.error("❌ Title and content are required for notification");
      return null;
    }

    const notification = await AppMessage.create({
      notificationType,
      receiverId,
      receiverType,
      title,
      content,
      relatedItemId,
      relatedItemType,
      imageUrl,
      priority,
    });

    console.log(`✅ Notification created: ${notificationType} for user ${receiverId}`);
    return notification;
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    return null;
  }
};

// إنشاء إشعارات لجميع الأعضاء (عند إضافة خبر جديد، عرض جديد، إلخ)
const createNotificationForAllMembers = async (notificationData) => {
  try {
    const { Member } = require("../Model/index");
    const members = await Member.findAll({
      where: { isActive: true },
      attributes: ["id"],
    });

    const notifications = [];
    for (const member of members) {
      const notification = await createNotification({
        ...notificationData,
        receiverId: member.id,
        receiverType: "member",
      });
      if (notification) notifications.push(notification);
    }

    console.log(`✅ Created ${notifications.length} notifications for all members`);
    return notifications;
  } catch (error) {
    console.error("❌ Error creating notifications for all members:", error);
    return [];
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 100, userId, notificationType, isRead } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { isDeleted: false };

    // Filter by user
    if (userId) {
      where[Op.or] = [
        { receiverId: userId },
        { receiverType: "all" },
      ];
    }

    // Filter by notification type
    if (notificationType) {
      where.notificationType = notificationType;
    }

    // Filter by read status
    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    const { count, rows: messages } = await AppMessage.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      success: true,
      data: messages,
      count: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const {
      notificationType,
      receiverId,
      receiverType,
      title,
      content,
      relatedItemId,
      relatedItemType,
      imageUrl,
      priority,
      sendToAll = false,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "title and content are required",
      });
    }

    let notification;

    if (sendToAll) {
      // إرسال إشعار لجميع الأعضاء
      const notifications = await createNotificationForAllMembers({
        notificationType: notificationType || "system",
        title,
        content,
        relatedItemId,
        relatedItemType,
        imageUrl,
        priority: priority || "normal",
      });
      return res.status(201).json({
        success: true,
        message: "Notifications created successfully for all members",
        data: notifications,
        count: notifications.length,
      });
    } else {
      // إرسال إشعار لمستخدم محدد
      if (!receiverId) {
        return res.status(400).json({
          success: false,
          message: "receiverId is required when sendToAll is false",
        });
      }

      notification = await createNotification({
        notificationType: notificationType || "system",
        receiverId,
        receiverType: receiverType || "member",
        title,
        content,
        relatedItemId,
        relatedItemType,
        imageUrl,
        priority: priority || "normal",
      });

      if (!notification) {
        return res.status(500).json({
          success: false,
          message: "Failed to create notification",
        });
      }

      res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: notification,
      });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ success: false, message: "Error creating notification", error: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await AppMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ success: false, message: "Error fetching notification", error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await AppMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    await message.update({
      isRead: true,
      readAt: new Date(),
    });

    res.json({ success: true, message: "Notification marked as read", data: message });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Error marking notification as read", error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await AppMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    await message.update({ isDeleted: true });

    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, message: "Error deleting notification", error: error.message });
  }
};

// Export helper functions for use in other controllers
exports.createNotification = createNotification;
exports.createNotificationForAllMembers = createNotificationForAllMembers;

