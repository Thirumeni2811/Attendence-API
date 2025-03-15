const express = require("express");
const { scheduleController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { scheduleValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  .post(auth(), scheduleController.createSchedule)
  .get(auth(), scheduleController.getSchedule);

router
  .route("/:scheduleId")
  .get(auth(), validate(scheduleValidation.scheduleId), scheduleController.getScheduleById)
  .patch(auth(), validate(scheduleValidation.scheduleId), scheduleController.updateSchedule)
  .delete(auth(), validate(scheduleValidation.scheduleId), scheduleController.deleteSchedule);

module.exports = router;
