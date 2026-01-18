const express = require("express");
const router = express.Router();
const memberAttendanceController = require("../controllers/memberAttendanceController");

router.post("/check-in", memberAttendanceController.checkIn);
router.post("/check-out", memberAttendanceController.checkOut);
router.get("/", memberAttendanceController.getAttendanceRecords);
router.get("/statistics", memberAttendanceController.getAttendanceStatistics);
router.get("/calendar", memberAttendanceController.getAttendanceCalendar);

module.exports = router;

