const httpStatus = require("http-status");
const { locationService } = require("../services");
const catchAsync = require("../utils/catchAsync");

//create location
const createLocation = catchAsync(async (req, res) => {
    const data = await locationService.createLocation(req.user.organisation, req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Location created successfully",
        data,
    });
});

//get location
const getLocation = catchAsync(async (req, res) => {
    const data = await locationService.getLocation(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

//update location
const updateLocation = catchAsync(async (req, res) => {
    const data = await locationService.updateLocation(req.user.organisation, req.params.locId, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Location updated successfully",
        data,
    });
});

//delete location
const deleteLocation = catchAsync(async (req, res) => {
    await locationService.deleteLocation(req.user.organisation, req.params.locId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createLocation,
    getLocation,
    updateLocation,
    deleteLocation,
}