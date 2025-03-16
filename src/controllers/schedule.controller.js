const httpStatus = require("http-status");
const { scheduleService } = require("../services");
const catchAsync = require("../utils/catchAsync");

//create Schedule
const createSchedule = catchAsync(async (req, res) => {
    const data = await scheduleService.createSchedule(req.user.organisation, req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Schedule created successfully",
        data,
    });
});

//get Schedule
const getSchedule = catchAsync(async (req, res) => {
    const data = await scheduleService.getSchedule(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

//update Schedule
const updateSchedule = catchAsync(async (req, res) => {
    const data = await scheduleService.updateSchedule(req.user.organisation, req.params.scheduleId, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Schedule updated successfully",
        data,
    });
});

//delete Schedule
const deleteSchedule = catchAsync(async (req, res) => {
    await scheduleService.deleteSchedule(req.user.organisation, req.params.scheduleId);
    res.status(httpStatus.NO_CONTENT).send();
});

//get by id
const getScheduleById = catchAsync(async (req, res) => {
    const data = await scheduleService.getScheduleById(req.user.organisation, req.params.scheduleId);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
})

// Create a new break
const addBreakToSchedule = catchAsync(async (req, res) => {
    const data = await scheduleService.addBreakToSchedule(req.user.organisation, req.params.scheduleId, req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Break added successfully",
        data,
    });
});

// Update a break
const updateBreakInSchedule = catchAsync(async (req, res) => {
    const data = await scheduleService.updateBreakInSchedule(req.user.organisation, req.params.scheduleId, req.params.breakId, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Break updated successfully",
        data,
    });
});

// Delete a break
const deleteBreakFromSchedule = catchAsync(async (req, res) => {
    await scheduleService.deleteBreakFromSchedule(req.user.organisation, req.params.scheduleId, req.params.breakId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    addBreakToSchedule,
    updateBreakInSchedule,
    deleteBreakFromSchedule,
}