const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainerController");

router.get("/:trainerId/details", trainerController.getTrainerDetails);

module.exports = router;

