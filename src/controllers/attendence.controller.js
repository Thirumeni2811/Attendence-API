const catchAsync = require("../utils/catchAsync");
const { attendenceService } = require("../services");
const httpStatus = require("http-status");

/**
 * marking attendance (Check-In / Check-Out)
 */
const markAttendences = catchAsync(async (req, res) => {
    const data = await attendenceService.markAttendance(req.user._id, req.body);
    return res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

//get attendence by userId
const getAttendencesById = catchAsync(async (req, res) => {
    const data = await attendenceService.getAttendenceById(req.user._id);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

//get attendence by organisation id
const getAttendencesByOrganisationId = catchAsync(async (req, res) => {
    const data = await attendenceService.getAttendenceByOrganisationId(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

//get attendence management by userId
const getAttendencesManagementById = catchAsync(async (req, res) => {
    const data = await attendenceService.getAttendenceManagementById(req.user._id);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

//get attendence management by organisation id
const getAttendencesManagementByOrganisationId = catchAsync(async (req, res) => {
    const data = await attendenceService.getAttendenceManagementByOrganisationId(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

module.exports = {
    markAttendences,
    getAttendencesById,
    getAttendencesByOrganisationId,
    getAttendencesManagementById,
    getAttendencesManagementByOrganisationId,
};
