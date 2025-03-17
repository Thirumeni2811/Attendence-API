const httpStatus = require("http-status");
const Holiday = require("../models/holiday.model");
const Organisation = require("../models/organisation.model");
const ApiError = require("../utils/ApiError");

/**
 * Create Holiday
 */
const createHoliday = async (orgId, body) => {
    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organisation not found");
    }
    body.organisation = organisation.id;
    const existingHoliday = await Holiday.findOne({
        organisation: organisation.id,
        date: body.date
    });
    if (existingHoliday) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This Holiday name already exists in this organisation");
    }
    const holiday = await Holiday.create(body);
    organisation.holiday.push(holiday.id);
    await organisation.save();
    return holiday;
}

/**
 * Get Holiday By Organisation Id
 */
const getHoliday = async (organisationId) => {
    const Holidays = await Holiday.find({ organisation: organisationId });
    return Holidays;
}

/**
 * Update Holiday
 */
const updateHoliday = async (organisationId, holidayId, body) => {
    const holiday = await Holiday.findOne({
        _id: holidayId,
        organisation: organisationId,
    });
    if (!holiday) {
        throw new ApiError(httpStatus.NOT_FOUND, "Holiday not found or does not belong to the organisation");
    }
    const organisation = await Organisation.findById(organisationId);
    if (body.date) {
        const existingHoliday = await Holiday.findOne({
            organisation: organisation.id,
            date: body.date,
            _id: { $ne: holidayId }
        });
        if (existingHoliday) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This Holiday name already exists in this organisation");
        }
    }
    const updateHoliday = await Holiday.findByIdAndUpdate(holidayId, body, {
        new: true,
        runValidators: true,
    });
    return updateHoliday;
}

/**
 * Delete Holiday
 */
const deleteHoliday = async (organisationId, holidayId) => {
    const holiday = await Holiday.findOneAndDelete({
        _id: holidayId,
        organisation: organisationId,
    });
    if (!holiday) {
        throw new ApiError(httpStatus.NOT_FOUND, "Holiday not found or does not belong to the organisation");
    }
    return holiday;
}

module.exports = {
    createHoliday,
    getHoliday,
    updateHoliday,
    deleteHoliday,
}