const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { designationService } = require("../services");

// Create Designation
const createDesignations = catchAsync(async (req, res) => {
    const data = await designationService.createDesignation(req.user.organisation, req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Designation created successfully",
        data,
    });
});

// Get Designation
const getDesignations = catchAsync(async (req, res) => {
    const data = await designationService.getDesignationById(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

// Update Designation
const updateDesignations = catchAsync(async (req, res) => {
    const data = await designationService.updateDesignation(req.user.organisation, req.params.desgId, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Designation updated successfully",
        data,
    });
});

// Delete Designation
const deleteDesignations = catchAsync(async (req, res) => {
    await designationService.deleteDesignation(req.user.organisation, req.params.desgId, req.body);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createDesignations,
    getDesignations,
    updateDesignations,
    deleteDesignations
};
