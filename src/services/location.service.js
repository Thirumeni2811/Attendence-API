const httpStatus = require("http-status");
const Location = require("../models/location.model");
const Organisation = require("../models/organisation.model");
const ApiError = require("../utils/ApiError");

/**
 * Create location
 */
const createLocation = async (orgId, body) => {
    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organisation not found");
    }
    body.organisation = organisation.id;
    const existingLocation = await Location.findOne({
        organisation: organisation.id,
        name: body.name
    });
    if (existingLocation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This location name already exists in this organisation");
    }
    const location = await Location.create(body);
    organisation.location.push(location.id);
    await organisation.save();
    return location;
}

/**
 * Get location By Organisation Id
 */
const getLocation = async (organisationId) => {
    const locations = await Location.find({ organisation: organisationId });
    return locations;
}

/**
 * Update location
 */
const updateLocation = async (organisationId, locId, body) => {
    const location = await Location.findOne({
        _id: locId,
        organisation: organisationId,
    });
    if (!location) {
        throw new ApiError(httpStatus.NOT_FOUND, "Location not found or does not belong to the organisation");
    }
    const organisation = await Organisation.findById(organisationId);
    if (body.name) {
        const existingLocation = await Location.findOne({
            organisation: organisation.id,
            name: body.name,
            _id: { $ne: locId }
        });
        if (existingLocation) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This location name already exists in this organisation");
        }
    }
    const updateLocation = await Location.findByIdAndUpdate(locId, body, {
        new: true,
        runValidators: true,
    });
    return updateLocation;
}

/**
 * Delete location
 */
const deleteLocation = async (organisationId, locId) => {
    const location = await Location.findOneAndDelete({
        _id: locId,
        organisation: organisationId,
    });
    if (!location) {
        throw new ApiError(httpStatus.NOT_FOUND, "Location not found or does not belong to the organisation");
    }
    return location;
}

module.exports = {
    createLocation,
    getLocation,
    updateLocation,
    deleteLocation,
}