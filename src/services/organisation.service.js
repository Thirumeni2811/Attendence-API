const httpStatus = require("http-status");
const Organisation = require("../models/organisation.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

/**
 * Create the organisation
 */
const createOrganisation = async (body, id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }
    // Check if the user already owns an organisation
    const existingOrg = await Organisation.findOne({ owner: id });
    if (existingOrg) {
        throw new ApiError(httpStatus.CONFLICT, "Organisation already exists");
    }

    body.owner = user;
    body.isOrganisationCreated = true;
    const organisation = await Organisation.create(body);
    user.organisation = organisation._id;
    await user.save();

    return organisation;
};

/**
 * Get organisation b Id
 */
const getOrganisationById = async (id) => {
    const organisation = await Organisation.findById(id).populate('owner', 'email role');
    // console.log(organisation)
    return organisation;
}

/**
 * Update organisation by Id
 */
const updateOrganisationById = async (id, body) => {
    const organisation = await Organisation.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });
    if (!organisation) {
        throw new ApiError(httpStatus.NOT_FOUND, "Organisation not found");
    }
    return organisation;
}

/**
 * Get All organisation | Creator
 */
const getAllOrganisation = async () => {
    const organisation = await Organisation.find();
    return organisation;
}

/**
 * Create batches
 */
const createBatch = async (orgId, body) => {
    const organisation = await Organisation.findByIdAndUpdate(
        orgId,
        { $addToSet: { batch: { $each: body.batch } } }, // Push multiple values into the array
        { new: true, runValidators: true }
    );

    if (!organisation) {
        throw new ApiError(httpStatus.NOT_FOUND, "Organisation not found");
    }

    return organisation; 
};


/**
 * Get batches
 */
const getBatch = async (orgId) => {
    const batch = await Organisation.findById(orgId).select("batch");
    return batch.batch;
}

module.exports = {
    createOrganisation,
    getAllOrganisation,
    getOrganisationById,
    updateOrganisationById,
    createBatch,
    getBatch,
};