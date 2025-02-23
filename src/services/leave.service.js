const Leave = require("../models/leave.model");
const User = require("../models/user.model");

/**
 * Leave request by user
 */
const leaveRequest = async (id, body) => {
    const { startDate, endDate } = body;
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }
    const existingLeave = await Leave.findOne({
        employee: id,
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Overlapping leave
            { startDate: startDate, endDate: endDate }, // Exact match
        ],
    });

    if (existingLeave) {
        throw new Error("Leave already requested for this period");
    }
    body.employee = user.id;
    body.organisation = user.organisation;
    const leave = await Leave.create(body);
    user.leave.push(leave.id);
    await user.save();
    return leave;
}

/**
 * Leave approvals
 */
const processLeave = async (leaveId, userId, status, feedback) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }
    const leave = await Leave.findById(leaveId);
    if (!leave) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Leave not found");
    }
    leave.status = status;
    leave.feedback = feedback;
    leave.approvedBy = userId; // Admin/Manager who approved/rejected
    await leave.save();

    return leave;
}

// Get leaves by user ID
const getLeavesByUser = async (userId) => {
    return await Leave.find({ employee: userId })
};

// Get leaves by organisation ID
const getLeavesByOrganisation = async (organisationId) => {
    return await Leave.find({ organisation: organisationId });
};

module.exports = {
    leaveRequest,
    processLeave,
    getLeavesByUser,
    getLeavesByOrganisation,
}