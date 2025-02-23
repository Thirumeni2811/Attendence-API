const express = require("express");
const departmentController = require("../../controllers/department.controller");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const departmentValidation = require("../../validations/department.validation");

const router = express.Router();

router
  .route("/")
  .post(auth(), departmentController.createDepartments)
  .get(auth(), departmentController.getDepartments)

router
  .route("/:deptId")
  .patch(auth(), validate(departmentValidation.departmentId), departmentController.updateDepartments)
  .delete(auth(), validate(departmentValidation.departmentId), departmentController.deleteDepartments)

module.exports = router;
