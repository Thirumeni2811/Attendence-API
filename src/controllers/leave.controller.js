const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { leaveService } = require("../services");

// leave request
const leaveRequests = catchAsync(async (req, res) => {
    const data = await leaveService.leaveRequest(req.user._id, req.body)
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Requested leave successfully",
        data,
    });
})

// leave approvals
const leaveApprovals = catchAsync(async (req, res) => {
    const { status, feedback } = req.body;
    const data = await leaveService.processLeave(req.params.leaveId, req.user._id, status, feedback)
    res.status(httpStatus.CREATED).send({
        code: httpStatus.OK,
        data,
    });
})

// Get leaves for the logged-in user
const getLeavesByUser = catchAsync(async (req, res) => {
    const data = await leaveService.getLeavesByUser(req.user._id);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

// Get all leaves for the user's organisation
const getLeavesByOrganisation = catchAsync(async (req, res) => {
    const data = await leaveService.getLeavesByOrganisation(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

module.exports = {
    leaveRequests,
    leaveApprovals,
    getLeavesByUser,
    getLeavesByOrganisation,
}