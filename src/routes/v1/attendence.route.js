const express = require("express");
const auth = require("../../middlewares/auth");
const attendanceController = require("../../controllers/attendence.controller");
const validate = require("../../middlewares/validate");
const { attendenceValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  .post(auth(), validate(attendenceValidation.actionSchema), attendanceController.markAttendences)
  .get(auth(), attendanceController.getAttendencesById)

router
  .route("/getAll")
  .get(auth(), attendanceController.getAttendencesByOrganisationId)

router
  .route("/getAttendence")
  .get(auth(), attendanceController.getAttendencesManagementById)

module.exports = router;
