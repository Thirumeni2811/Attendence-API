const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Setting = require("../models/setting.model");

/**
 * Setting - Create
 * Only one document should exist
 */
const createSetting = async (settingBody) => {
  const existingSetting = await Setting.findOne();
  if (existingSetting) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "A Setting already exists. Use the update function instead."
    );
  }
  return Setting.create(settingBody);
};

/**
 * Setting - Update
 * Updates the single existing document
 */
const updateSetting = async (updateBody) => {
  const update = await Setting.findOneAndUpdate({}, updateBody, {
    new: true, //  return the updated document
    runValidators: true,
  });
  if (!update) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No Setting found to update. Create one first."
    );
  }
  return update;
};

/**
 * Setting - Get
 * Retrieves the single existing documeny
 */
const getSetting = async () => {
  const read = await Setting.findOne();
  if (!read) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No Setting found. Create one first"
    );
  }
  return read;
};

module.exports = {
  createSetting,
  updateSetting,
  getSetting,
};
