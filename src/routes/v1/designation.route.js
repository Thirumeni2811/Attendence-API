const express = require("express");
const designationController = require("../../controllers/designation.controller");
const auth = require("../../middlewares/auth");
const designationValidation = require("../../validations/designation.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router
  .route("/")
  .post(auth(), designationController.createDesignations)
  .get(auth(), designationController.getDesignations)

router
  .route("/:desgId")
  .patch(auth(), validate(designationValidation.designationId), designationController.updateDesignations)
  .delete(auth(), validate(designationValidation.designationId), designationController.deleteDesignations)

module.exports = router;
