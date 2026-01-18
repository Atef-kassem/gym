const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

router.route("/")
  .get(classController.getAllClasses)
  .post(classController.createClass);

router.get("/statistics", classController.getClassStatistics);

router.route("/:id")
  .get(classController.getClassById)
  .put(classController.updateClass)
  .delete(classController.deleteClass);

router.post("/:classId/enroll/:memberId", classController.enrollMember);
router.delete("/:classId/remove/:memberId", classController.removeMember);
router.put("/:classId/attendance/:memberId", classController.updateAttendance);

module.exports = router;

