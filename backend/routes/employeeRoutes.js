const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { dynamicUpload } = require("../middlewares/fileUpload");

const employeeFileFields = ["profilePicture"];

router.route("/")
  .get(employeeController.getAllEmployees)
  .post(dynamicUpload(employeeFileFields), employeeController.createEmployee);

router.get("/trainers", employeeController.getTrainers);
router.get("/departments", employeeController.getDepartments);
router.post("/departments", employeeController.createDepartment);
router.get("/positions", employeeController.getPositions);

router.route("/:id")
  .get(employeeController.getEmployeeById)
  .put(dynamicUpload(employeeFileFields), employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;

