const User = require("../Model/userModel");
const AppError = require("../utils/appError");

module.exports = async (req, res, next) => {
    const { phoneNumber, password } = req.body;
    // Check if phone number and password are provided
    if (!phoneNumber || !password) {
        return next(new AppError('Please provide phone number and password', 400));
    }
    next();
}