const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const organisationService = require("../services/organisation.service");

// Create the organisation
const createOrganisation = catchAsync(async (req, res) => {
    const organisation = await organisationService.createOrganisation(req.body, req.user._id);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Organisation Created Successfully",
        data: organisation,
    })
})

// get organisation by Id
const getOrganisationsById = catchAsync(async (req, res) => {
    const organisation = await organisationService.getOrganisationById(req.params.id);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data: organisation,
    })
})

// update organisation by Id
const updateOrganisationsById = catchAsync(async (req, res) => {
    const organisation = await organisationService.updateOrganisationById(req.params.id, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data: organisation,
    })
})

//get all organisation || creator
const getAllOrganisations = catchAsync(async (req, res) => {
    const organisation = await organisationService.getAllOrganisation();
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data: organisation,
    })
})
//get all organisation || creator
const createbatches = catchAsync(async (req, res) => {
    const organisation = await organisationService.createBatch(req.user.organisation, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data: organisation,
    })
})

//get all organisation || creator
const getAllBatches = catchAsync(async (req, res) => {
    const organisation = await organisationService.getBatch(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data: organisation,
    })
})

module.exports = {
    createOrganisation,
    getAllOrganisations,
    getOrganisationsById,
    updateOrganisationsById,
    createbatches,
    getAllBatches,
}