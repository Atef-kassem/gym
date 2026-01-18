const express = require("express");
const router = express.Router();
const trainerSalaryController = require("../controllers/trainerSalaryController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// Apply authentication middleware to all routes
router.use(isLoggedIn);

// Get all trainer salaries
router.get("/", trainerSalaryController.getAllTrainerSalaries);

// Get active salary for a trainer
router.get("/trainer/:trainerId/active", trainerSalaryController.getActiveTrainerSalary);

// Get trainer salary by ID
router.get("/:id", trainerSalaryController.getTrainerSalary);

// Create trainer salary
router.post("/", trainerSalaryController.createTrainerSalary);

// Update trainer salary
router.patch("/:id", trainerSalaryController.updateTrainerSalary);
router.put("/:id", trainerSalaryController.updateTrainerSalary);

// Delete trainer salary
router.delete("/:id", trainerSalaryController.deleteTrainerSalary);

module.exports = router;

