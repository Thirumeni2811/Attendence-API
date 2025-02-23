const httpStatus = require("http-status");
const { holidayService } = require("../services");
const catchAsync = require("../utils/catchAsync");

//create Holiday
const createHoliday = catchAsync(async (req, res) => {
    const data = await holidayService.createHoliday(req.user.organisation, req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Holiday created successfully",
        data,
    });
});

//get Holiday
const getHoliday = catchAsync(async (req, res) => {
    const data = await holidayService.getHoliday(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

//update Holiday
const updateHoliday = catchAsync(async (req, res) => {
    const data = await holidayService.updateHoliday(req.user.organisation, req.params.holidayId, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Holiday updated successfully",
        data,
    });
});

//delete Holiday
const deleteHoliday = catchAsync(async (req, res) => {
    await holidayService.deleteHoliday(req.user.organisation, req.params.holidayId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createHoliday,
    getHoliday,
    updateHoliday,
    deleteHoliday,
}