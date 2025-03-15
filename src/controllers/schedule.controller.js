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

module.exports = {
    createSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
}