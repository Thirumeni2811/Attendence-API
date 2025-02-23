const express = require("express");
const { locationController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { locationValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  .post(auth(), locationController.createLocation)
  .get(auth(), locationController.getLocation);

router
  .route("/:locId")
  .patch(auth(), validate(locationValidation.locationId), locationController.updateLocation)
  .delete(auth(), validate(locationValidation.locationId), locationController.deleteLocation);

module.exports = router;
