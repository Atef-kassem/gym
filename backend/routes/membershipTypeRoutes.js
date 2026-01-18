const express = require("express");
const router = express.Router();
const membershipTypeController = require("../controllers/membershipTypeController");

router.route("/")
  .get(membershipTypeController.getAllMembershipTypes)
  .post(membershipTypeController.createMembershipType);

router.route("/:id")
  .get(membershipTypeController.getMembershipTypeById)
  .put(membershipTypeController.updateMembershipType)
  .delete(membershipTypeController.deleteMembershipType);

module.exports = router;

