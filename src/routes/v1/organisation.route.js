const express = require("express");
const organisationController = require("../../controllers/organisation.controller");
const checkRole = require("../../middlewares/checkRoles");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const organisationValidation = require("../../validations/organisation.validation");

const router = express.Router();

router
    .route("/")
    .post(
        auth(),
        checkRole("admin"),
        organisationController.createOrganisation
    )
    .get(
        auth(),
        checkRole("admin"),
        organisationController.getOrganisationsByToken
    )

router
    .route("/getAll")
    .get(
        auth(),
        checkRole("creator"),
        organisationController.getAllOrganisations
    )

router
    .route("/batch")
    .patch(
        auth(),
        organisationController.createbatches
    )
    .get(
        auth(),
        organisationController.getAllBatches
    )

router
    .route("/:id")
    .get(
        auth(),
        // checkRole("creator"),
        validate(organisationValidation.getOrganisation),
        organisationController.getOrganisationsById
    )
    .patch(
        auth(),
        // checkRole("creator"),
        validate(organisationValidation.getOrganisation),
        organisationController.updateOrganisationsById
    )

module.exports = router;