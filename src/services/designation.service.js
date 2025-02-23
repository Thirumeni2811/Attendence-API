const httpStatus = require("http-status");
const Designation = require("../models/designation.model");
const Organisation = require("../models/organisation.model");
const ApiError = require("../utils/ApiError");

/**
 * Create designations
 */
const createDesignation = async (organisationId, body) => {
    const organisation = await Organisation.findById(organisationId);
    if (!organisation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organisation not found");
    }
    body.organisation = organisation.id;
    const existingDesignation = await Designation.findOne({
        organisation: organisation.id,
        name: body.name
    });

    if (existingDesignation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This Designation already exists in this organisation");
    }

    const designations = await Designation.create(body);
    organisation.designation.push(designations.id);
    await organisation.save();
    return designations;
};

/**
 * Create designations
 */
const getDesignationById = async (organisationId) => {
    const designations = await Designation.find({ organisation: organisationId });
    return designations;
};

/**
 * Update designations
 */
const updateDesignation = async (organisationId, desgId, body) => {
    const designation = await Designation.findOne({ _id: desgId, organisation: organisationId });

    if (!designation) {
        throw new ApiError(httpStatus.NOT_FOUND, "Designation not found or does not belong to the organisation");
    }
    const organisation = await Organisation.findById(organisationId);
    if (body.name) {
        const existingDesignation = await Designation.findOne({
            organisation: organisation.id,
            name: body.name,
            _id: { $ne: desgId }
        });
    
        if (existingDesignation) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This Designation already exists in this organisation");
        }
    }

    const updateDesignation = await Designation.findByIdAndUpdate(desgId, body, {
        new: true,
        runValidators: true,
    });

    return updateDesignation;
};

/**
 * Delete Designation
 */
const deleteDesignation = async (organisationId, desgId) => {
    const designation = await Designation.findOneAndDelete({
        _id: desgId,
        organisation: organisationId,
    });

    if (!designation) {
        throw new ApiError(httpStatus.NOT_FOUND, "Designation not found or does not belong to the organisation");
    }

    return designation;
};

module.exports = {
    createDesignation,
    getDesignationById,
    updateDesignation,
    deleteDesignation,
}