const httpStatus = require("http-status");
const Department = require("../models/department.model");
const Organisation = require("../models/organisation.model");
const ApiError = require("../utils/ApiError");

/**
 * Create departments
 */
const createDepartment = async (organisationId, body) => {
    const organisation = await Organisation.findById(organisationId);
    if (!organisation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organisation not found");
    }
    body.organisation = organisation.id;
    const existingDepartment = await Department.findOne({
        organisation: organisation.id,
        name: body.name
    });

    if (existingDepartment) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This department already exists in this organisation");
    }
    const departments = await Department.create(body);
    organisation.department.push(departments.id);
    await organisation.save();
    return departments;
};

/**
 * Get departments
 */
const getDepartmentById = async (organisationId) => {
    const departments = await Department.find({ organisation: organisationId });
    return departments;
};

/**
 * Update departments
 */
const updateDepartment = async (organisationId, deptId, body) => {
    const department = await Department.findOne({ _id: deptId, organisation: organisationId });

    if (!department) {
        throw new ApiError(httpStatus.NOT_FOUND, "Department not found or does not belong to the organisation");
    }
    const organisation = await Organisation.findById(organisationId);
    if (body.name) {
        const existingDepartment = await Department.findOne({
            organisation: organisation.id,
            name: body.name,
            _id: { $ne: deptId }
        });
        if (existingDepartment) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This department already exists in this organisation");
        }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(deptId, body, {
        new: true,
        runValidators: true,
    });

    return updatedDepartment;
};


/**
 * Delete department
 */
const deleteDepartment = async (organisationId, deptId) => {
    const department = await Department.findOneAndDelete({
        _id: deptId,
        organisation: organisationId,
    });

    if (!department) {
        throw new ApiError(httpStatus.NOT_FOUND, "Department not found or does not belong to the organisation");
    }

    return department;
};


module.exports = {
    createDepartment,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
}