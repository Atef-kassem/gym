const { MemberAttendance, Member, Branch, User } = require("../Model/index");
const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");

// تسجيل دخول عضو
exports.checkIn = async (req, res) => {
  try {
    const { memberId, memberCode, branchId, notes } = req.body;
    const userId = req.user?.id;

    if (!memberId && !memberCode) {
      return res.status(400).json({
        success: false,
        message: "يجب توفير معرف العضو أو كود العضو",
      });
    }

    // البحث عن العضو
    let member;
    if (memberId) {
      member = await Member.findByPk(memberId);
    } else if (memberCode) {
      member = await Member.findOne({ where: { memberCode } });
    }

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "لم يتم العثور على العضو",
      });
    }

    // التحقق من وجود دخول سابق اليوم بدون خروج
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingCheckIn = await MemberAttendance.findOne({
      where: {
        memberId: member.id,
        attendanceDate: today.toISOString().split('T')[0],
        status: "checked_in",
      },
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        message: "العضو مسجل دخول بالفعل اليوم",
        data: existingCheckIn,
      });
    }

    // إنشاء سجل دخول جديد
    const attendance = await MemberAttendance.create({
      memberId: member.id,
      memberCode: member.memberCode || memberCode,
      memberName: member.name,
      branchId: branchId || member.branchId,
      checkInTime: new Date(),
      attendanceDate: today.toISOString().split('T')[0],
      status: "checked_in",
      notes: notes || null,
      createdBy: userId,
    });

    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: attendance,
    });
  } catch (error) {
    console.error("Error checking in member:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تسجيل الدخول",
      error: error.message,
    });
  }
};

// تسجيل خروج عضو
exports.checkOut = async (req, res) => {
  try {
    const { memberId, memberCode, attendanceId } = req.body;

    if (!memberId && !memberCode && !attendanceId) {
      return res.status(400).json({
        success: false,
        message: "يجب توفير معرف العضو أو كود العضو أو معرف السجل",
      });
    }

    let attendance;
    if (attendanceId) {
      attendance = await MemberAttendance.findByPk(attendanceId);
    } else {
      // البحث عن آخر دخول بدون خروج
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let whereClause = {
        attendanceDate: today.toISOString().split('T')[0],
        status: "checked_in",
      };

      if (memberId) {
        whereClause.memberId = memberId;
      } else if (memberCode) {
        whereClause.memberCode = memberCode;
      }

      attendance = await MemberAttendance.findOne({
        where: whereClause,
        order: [["checkInTime", "DESC"]],
      });
    }

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "لم يتم العثور على سجل دخول",
      });
    }

    if (attendance.status === "checked_out") {
      return res.status(400).json({
        success: false,
        message: "تم تسجيل الخروج مسبقاً",
      });
    }

    // حساب مدة الحضور
    const checkOutTime = new Date();
    const checkInTime = new Date(attendance.checkInTime);
    const duration = Math.floor((checkOutTime - checkInTime) / (1000 * 60)); // بالدقائق

    // تحديث السجل
    attendance.checkOutTime = checkOutTime;
    attendance.status = "checked_out";
    attendance.duration = duration;
    await attendance.save();

    res.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
      data: attendance,
    });
  } catch (error) {
    console.error("Error checking out member:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تسجيل الخروج",
      error: error.message,
    });
  }
};

// جلب سجل الحضور
exports.getAttendanceRecords = async (req, res) => {
  try {
    const {
      memberId,
      memberCode,
      branchId,
      startDate,
      endDate,
      status,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const where = {};

    if (memberId) {
      where.memberId = memberId;
    }
    if (memberCode) {
      where.memberCode = { [Op.like]: `%${memberCode}%` };
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (status) {
      where.status = status;
    }
    if (startDate && endDate) {
      where.attendanceDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.attendanceDate = { [Op.gte]: startDate };
    } else if (endDate) {
      where.attendanceDate = { [Op.lte]: endDate };
    }
    if (search) {
      where[Op.or] = [
        { memberName: { [Op.like]: `%${search}%` } },
        { memberCode: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await MemberAttendance.findAndCountAll({
      where,
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "name", "memberCode", "phone", "email"],
          required: false,
        },
        {
          model: Branch,
          as: "branch",
          attributes: ["id", "arabicName", "englishName"],
          required: false,
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "arabicName", "englinshName"],
          required: false,
        },
      ],
      order: [["checkInTime", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب سجل الحضور",
      error: error.message,
    });
  }
};

// جلب إحصائيات الحضور
exports.getAttendanceStatistics = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;

    const where = {};
    if (branchId) {
      where.branchId = branchId;
    }
    if (startDate && endDate) {
      where.attendanceDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalRecords,
      todayCheckIns,
      todayCheckOuts,
      activeCheckIns,
      membersByDate,
    ] = await Promise.all([
      MemberAttendance.count({ where }),
      MemberAttendance.count({
        where: {
          ...where,
          attendanceDate: today.toISOString().split('T')[0],
          status: "checked_in",
        },
      }),
      MemberAttendance.count({
        where: {
          ...where,
          attendanceDate: today.toISOString().split('T')[0],
          status: "checked_out",
        },
      }),
      MemberAttendance.count({
        where: {
          ...where,
          status: "checked_in",
        },
      }),
      MemberAttendance.findAll({
        where: {
          ...where,
          attendanceDate: {
            [Op.gte]: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
          },
        },
        attributes: [
          "attendanceDate",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        group: ["attendanceDate"],
        order: [["attendanceDate", "ASC"]],
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalRecords,
        todayCheckIns,
        todayCheckOuts,
        activeCheckIns,
        membersByDate: membersByDate.map((item) => ({
          date: item.attendanceDate,
          count: parseInt(item.get("count")),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching attendance statistics:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب إحصائيات الحضور",
      error: error.message,
    });
  }
};

// جلب بيانات calendar للحضور
exports.getAttendanceCalendar = async (req, res) => {
  try {
    const { memberId, month, year } = req.query;
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "معرف العضو مطلوب",
      });
    }

    // تحديد التاريخ الأول والأخير من الشهر
    const startDate = year && month 
      ? `${year}-${String(month).padStart(2, '0')}-01`
      : new Date().toISOString().split('T')[0].substring(0, 7) + '-01';
    
    const endDate = year && month
      ? new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const where = {
      memberId: parseInt(memberId),
      attendanceDate: {
        [Op.between]: [startDate, endDate],
      },
    };

    const attendanceRecords = await MemberAttendance.findAll({
      where,
      attributes: ['id', 'attendanceDate', 'checkInTime', 'checkOutTime', 'status', 'duration'],
      order: [["attendanceDate", "ASC"]],
    });

    // تحويل البيانات إلى format مناسب للـ calendar
    const calendarData = attendanceRecords.map(record => ({
      date: record.attendanceDate,
      checkIn: record.checkInTime,
      checkOut: record.checkOutTime,
      status: record.status,
      duration: record.duration,
    }));

    res.json({
      success: true,
      data: calendarData,
      count: calendarData.length,
    });
  } catch (error) {
    console.error("Error fetching attendance calendar:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب بيانات calendar",
      error: error.message,
    });
  }
};

