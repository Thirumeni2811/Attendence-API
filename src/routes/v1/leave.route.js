const express = require("express");
const { leaveController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { leaveValidation } = require("../../validations");

const router = express.Router();

router
    .route("/")
    .post(auth(), leaveController.leaveRequests)
    .get(auth(), leaveController.getLeavesByUser)

router
    .route("/getAll")
    .get(auth("getUsers"), leaveController.getLeavesByOrganisation)

router
    .route("/:empId")
    .get(auth("getUsers"), leaveController.getLeavesByUserId)
    .patch(auth("manageUsers"), validate(leaveValidation.leaveId), leaveController.leaveApprovals)

module.exports = router;
