const express = require("express");
const { holidayController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { holidayValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  .post(auth(), holidayController.createHoliday)
  .get(auth(), holidayController.getHoliday);

router
  .route("/:holidayId")
  .patch(auth(), validate(holidayValidation.holidayId), holidayController.updateHoliday)
  .delete(auth(), validate(holidayValidation.holidayId), holidayController.deleteHoliday);

module.exports = router;
