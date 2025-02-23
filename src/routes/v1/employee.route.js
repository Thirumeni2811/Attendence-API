const express = require("express");
const { employeeController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { employeeValidation } = require("../../validations");

const router = express.Router()

router
  .route("/")
  .post(auth(), employeeController.createEmployees)
  //for organisation
  .get(auth(), employeeController.getEmployees)
  //By token
  .get(auth(), employeeController.getEmployeesByToken)

router
  .route("/:empId")
  .get(auth(), validate(employeeValidation.getEmployeeById), employeeController.getEmployeesById)
  .patch(auth(), validate(employeeValidation.updateEmployee), employeeController.updateEmployees)
  .delete(auth(), validate(employeeValidation.deleteEmployee), employeeController.deleteEmployees)

module.exports = router;