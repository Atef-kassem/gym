const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { dynamicUpload } = require("../middlewares/fileUpload");

const memberFileFields = ["profilePicture"];

router.route("/")
  .get(memberController.getAllMembers)
  .post(dynamicUpload(memberFileFields), memberController.createMember);

router.get("/statistics", memberController.getMemberStatistics);

router.route("/:id")
  .get(memberController.getMemberById)
  .put(dynamicUpload(memberFileFields), memberController.updateMember)
  .delete(memberController.deleteMember);

module.exports = router;

