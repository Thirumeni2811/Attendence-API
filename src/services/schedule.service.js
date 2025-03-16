const httpStatus = require("http-status");
const Schedule = require("../models/schedule.model");
const Organisation = require("../models/organisation.model");
const ApiError = require("../utils/ApiError");

/**
 * Create Schedule
 */
const createSchedule = async (orgId, body) => {
    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organisation not found");
    }
    body.organisation = organisation.id;
    const existingSchedule = await Schedule.findOne({
        organisation: organisation.id,
        name: body.name
    });
    if (existingSchedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This Schedule name already exists in this organisation");
    }
    const schedule = await Schedule.create(body);
    organisation.schedule.push(schedule.id);
    await organisation.save();
    return schedule;
}

/**
 * Get Schedule By Organisation Id
 */
const getSchedule = async (organisationId) => {
    const Schedules = await Schedule.find({ organisation: organisationId });
    return Schedules;
}

/**
 * Update Schedule
 */
const updateSchedule = async (organisationId, scheduleId, body) => {
    const schedule = await Schedule.findOne({
        _id: scheduleId,
        organisation: organisationId,
    });
    if (!schedule) {
        throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found or does not belong to the organisation");
    }
    const organisation = await Organisation.findById(organisationId);
    if (body.name) {
        const existingSchedule = await Schedule.findOne({
            organisation: organisation.id,
            name: body.name,
            _id: { $ne: scheduleId }
        });

        if (existingSchedule) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This Schedule name already exists in this organisation");
        }
    }

    const updateSchedule = await Schedule.findByIdAndUpdate(scheduleId, body, {
        new: true,
        runValidators: true,
    });
    return updateSchedule;
}

/**
 * Delete Schedule
 */
const deleteSchedule = async (organisationId, scheduleId) => {
    const schedule = await Schedule.findOneAndDelete({
        _id: scheduleId,
        organisation: organisationId,
    });
    if (!schedule) {
        throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found or does not belong to the organisation");
    }
    return schedule;
}

/**
 * Get the Id
 */
const getScheduleById = async (organisationId, scheduleId) => {
    const schedule = await Schedule.findOne({ _id: scheduleId, organisation: organisationId });
    if (!schedule) {
        throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found or does not belong to the organisation");
    }
    return schedule;
};

/**
 * Add breaks
 */
const addBreakToSchedule = async (organisationId, scheduleId, breakData) => {
    const schedule = await Schedule.findOne({ _id: scheduleId, organisation: organisationId });
    if (!schedule) {
        throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found or does not belong to the organisation");
    }

    schedule.breaks.push(breakData);
    await schedule.save();

    return schedule;
};

/**
 * Update breaks
 */
const updateBreakInSchedule = async (organisationId, scheduleId, breakId, breakData) => {
    const schedule = await Schedule.findOne({ _id: scheduleId, organisation: organisationId });
    if (!schedule) {
        throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found or does not belong to the organisation");
    }

    const breakIndex = schedule.breaks.findIndex((br) => br._id.toString() === breakId);
    if (breakIndex === -1) {
        throw new ApiError(httpStatus.NOT_FOUND, "Break not found in the schedule");
    }

    schedule.breaks[breakIndex] = { ...schedule.breaks[breakIndex].toObject(), ...breakData };
    await schedule.save();

    return schedule;
};

/**
 * Delete Break
 */
const deleteBreakFromSchedule = async (organisationId, scheduleId, breakId) => {
    const schedule = await Schedule.findOne({ _id: scheduleId, organisation: organisationId });
    if (!schedule) {
        throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found or does not belong to the organisation");
    }

    const initialLength = schedule.breaks.length;
    schedule.breaks = schedule.breaks.filter((br) => br._id.toString() !== breakId);

    if (schedule.breaks.length === initialLength) {
        throw new ApiError(httpStatus.NOT_FOUND, "Break not found in the schedule");
    }

    await schedule.save();

    return schedule;
};

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