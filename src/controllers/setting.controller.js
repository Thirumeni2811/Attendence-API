const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { settingService } = require("../services");

// Create credit limitations
const createLimits = catchAsync(async (req, res) => {
  const data = await settingService.createSetting(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: "Credits limits created successfully",
    data,
  });
});

// Get credit limitations
const getLimits = catchAsync(async (req, res) => {
  const data = await settingService.getSetting();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    data,
  });
});

// Update credit limitations
const updateLimits = catchAsync(async (req, res) => {
  const data = await settingService.updateSetting(req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Credits limits updated successfully",
    data,
  });
});

module.exports = {
  createLimits,
  getLimits,
  updateLimits,
};
