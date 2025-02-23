const express = require("express");
const settingController = require("../../controllers/setting.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(auth("manageUsers"), settingController.createLimits)
  .get(auth("getUsers"), settingController.getLimits)
  .patch(auth("manageUsers"), settingController.updateLimits);

module.exports = router;
