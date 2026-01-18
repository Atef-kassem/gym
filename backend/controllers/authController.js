const User = require("../Model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const usableRes = require("../utils/usableRes");
const { Op } = require("sequelize");
// ? Signup function to create a new user
exports.signup = catchAsync(async (req, res, next) => {
  const { arabicName, englinshName, email, password, phoneNumber, branchId } = req.body;
  const newUser = await User.create({
    // to prevent user from sending unwanted data, we can use destructuring and rest operator
    arabicName,
    englinshName,
    email,
    password,
    phoneNumber,
    branchId,
  });
  if (!newUser) {
    return next(new AppError("please provide a valid user data", 400));
  }
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// ? Login function to authenticate a user
exports.login = catchAsync(async (req, res, next) => {
  // TODO 1) Check if user exists in the database
  const { phoneNumber, password } = req.body;
  
  console.log('Login attempt for phone number:', phoneNumber);
  
  // تنظيف رقم الهاتف: إزالة المسافات والرموز الخاصة
  const cleanPhoneNumber = phoneNumber?.trim().replace(/[\s\-\(\)\+]/g, '');
  console.log('Original phone number:', phoneNumber);
  console.log('Cleaned phone number:', cleanPhoneNumber);
  
  // البحث عن المستخدم برقم الهاتف (مع دعم تنسيقات مختلفة)
  // البحث بالرقم المباشر أو بدون البادئة 0
  let userForAuth = await User.findOne({ 
    where: { phoneNumber: cleanPhoneNumber },
    attributes: ['id', 'email', 'phoneNumber', 'password', 'arabicName', 'englinshName', 'active']
  });
  
  // إذا لم يتم العثور عليه، جرب البحث بدون البادئة 0
  if (!userForAuth && cleanPhoneNumber.startsWith('0')) {
    const phoneWithoutZero = cleanPhoneNumber.substring(1);
    userForAuth = await User.findOne({ 
      where: { phoneNumber: phoneWithoutZero },
      attributes: ['id', 'email', 'phoneNumber', 'password', 'arabicName', 'englinshName', 'active']
    });
  }
  
  // إذا لم يتم العثور عليه، جرب البحث مع البادئة 0
  if (!userForAuth && !cleanPhoneNumber.startsWith('0')) {
    const phoneWithZero = '0' + cleanPhoneNumber;
    userForAuth = await User.findOne({ 
      where: { phoneNumber: phoneWithZero },
      attributes: ['id', 'email', 'phoneNumber', 'password', 'arabicName', 'englinshName', 'active']
    });
  }

  if (!userForAuth) {
    console.log('User not found for phone number:', phoneNumber);
    return next(new AppError("Incorrect phone number or password", 401));
  }

  console.log('User found:', { id: userForAuth.id, phoneNumber: userForAuth.phoneNumber, hasPassword: !!userForAuth.password });

  // TODO 2) Check if password is correct
  const isPasswordCorrect = await userForAuth.correctPassword(password, userForAuth.password);
  console.log('Password check result:', isPasswordCorrect);
  
  if (!isPasswordCorrect) {
    console.log('Password incorrect for user:', userForAuth.id);
    return next(new AppError("Incorrect phone number or password", 401));
  }

  console.log('Login successful for user:', userForAuth.id);

  // TODO 3) Get full user data with relations for response
  const fullUser = await User.findByPk(userForAuth.id, {
    include: [
      { 
        model: require("../Model").Branch, 
        as: 'branch', 
        attributes: ['id', 'arabicName'],
        required: false
      },
      { 
        model: require("../Model").Section, 
        as: 'section', 
        attributes: ['id', 'sectionName'],
        required: false
      },
      { 
        model: require("../Model").UserRole, 
        as: 'userRoles', 
        attributes: ['id'],
        required: false,
        include: [
          { 
            model: require("../Model").Role, 
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

  // Transform user data to match frontend expectations
  const transformedUser = {
    id: fullUser.id,
    name: fullUser.arabicName,
    nameEn: fullUser.englinshName,
    email: fullUser.email,
    phone: fullUser.phoneNumber,
    mobile: fullUser.telephoneNumber,
    nationalId: fullUser.ssNumber,
    role: fullUser.userRoles?.[0]?.role?.roleName || 'بدون دور',
    department: fullUser.section?.sectionName || 'بدون قسم',
    branch: fullUser.branch?.arabicName || 'بدون فرع',
    position: '',
    supervisor: '',
    hireDate: fullUser.startDate,
    salary: fullUser.salary,
    status: fullUser.active ? 'active' : 'inactive',
    lastLogin: 'لم يسجل دخول بعد',
    address: {
      country: fullUser.country || '',
      city: fullUser.city || '',
      district: fullUser.nighborhood || '',
      street: fullUser.street || '',
      postalCode: fullUser.postalCode || ''
    },
    emergency: {
      name: fullUser.emergencyContactName || '',
      phone: fullUser.emergencyContactPhone || '',
      relation: fullUser.emergencyContactRelation || ''
    }
  };

  // TODO 4) If everything is ok, send token with full user data
  await usableRes(res, 200, "success", transformedUser);
});

// ? Forgot password function to handle password reset requests
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // TODO 1) Get user based on POSTed email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // TODO 2) Generate a reset token and save it to the user document
  const resetToken = user.createPasswordResetToken();

  user.save({ validateBeforeSave: false }); // Save the user with the reset token without validation

  // TODO 3) Create a reset URL
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.
                      \nIf you didn't forget your password, please ignore this email!`;

  try {
    // TODO 4) Send it to the user
    await sendEmail({
      email,
      subject: "Your password reset token (valid for 10 min)",
      resetToken, // Pass the reset token to the email function
      url: resetURL, // Pass the reset URL to the email function
    }); // Send the email with the reset token and URL

    res.status(200).json({
      status: "success",
      message: " Reset Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined; // Clear the reset token
    user.passwordResetExpires = undefined; // Clear the expiration time
    await user.save({ validateBeforeSave: false }); // Save the user without validation

    return next(new AppError("There was an error sending the email. Try again later!", 500));
  }
});

// ? Reset password function to update the user's password using the reset token
exports.resetPassword = catchAsync(async (req, res, next) => {
  // TODo 1) Get the token from the URL parameters
  const { token } = req.params;

  const { password } = req.body; // Get the new password from the request body

  const hashedToken = crypto.createHash("sha256").update(token.toString()).digest("hex");

  // TODO 2) Find the user by the reset token and check if it hasn't expired
  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() } // Check if the token is still valid
    }
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // TODO 3) Update the user's password and clear the reset token and expiration time
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // Save the updated user document

  // TODO 4) Generate a new token for the user

  await usableRes(res, 200, "success", user);

  /* const newToken = await generateToken(user);

  res.status(200).json({
    status: "success",
    token: newToken, // Return the new token in the response
  }); */
});

// ? Get current user profile
exports.getMe = catchAsync(async (req, res, next) => {
  // req.user يتم تعيينه بواسطة middleware المصادقة
  if (!req.user) {
    return next(new AppError("You are not logged in", 401));
  }

  // استيراد النماذج المطلوبة
  const { UserRole, Role } = require("../Model");

  // الحصول على بيانات المستخدم الحالي مع معلومات الدور
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }, // استبعاد كلمة المرور
    include: [{
      model: UserRole,
      as: 'userRoles',
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'roleName', 'description', 'modules']
      }]
    }]
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // إضافة roleId للمستخدم إذا كان لديه دور
  let userData = user.toJSON();
  if (userData.userRoles && userData.userRoles.length > 0) {
    userData.roleId = userData.userRoles[0].role.id;
    userData.role = userData.userRoles[0].role;
  }

  await usableRes(res, 200, "success", userData);
});

// ? Update password function to change the user's password

exports.updatePassword = catchAsync(async (req, res, next) => {
  // TODO 1) get user

  const { id } = req.user;
  const user = await User.findByPk(id, {
    attributes: { include: ['password'] }
  });

  // TODO 2) check current user is correct

  const isCorrect = await user.correctPassword(req.body.currentPassword, user.password);
  if (!isCorrect) {
    return next(new AppError("please enter your current password", 401));
  }

  // TODO 3) then update password if so

  user.password = req.body.newPassword;
  await user.save();

  // TODO 4) then login user and send new token
  await usableRes(res, 200, "success", user);

  /* token = await generateToken(user);
  res.status(200).json({
    status: "success",
    token,
  }); */
});
