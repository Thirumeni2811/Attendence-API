const httpStatus = require("http-status");
const Employee = require("../models/employee.model");
const Organisation = require("../models/organisation.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

/**
 * Create the employee
 */
const createEmployee = async (organisationId, body) => {
    const organisation = await Organisation.findById(organisationId);
    if (!organisation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organisation not found");
    }

    body.organisation = organisation.id;

    const existingUser = await User.findOne({
        organisation: organisation.id,
        $or: [{ email: body.email }, { empId: body.empId }]
    });

    if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email or Employee ID already exists in this organisation");
    }

    const user = await User.create(body);

    organisation.employees.push(user.id);
    await organisation.save();

    return user;
};

/**
 * Get employees
 */
const getEmployee = async (organisationId) => {
    const employees = await User.find({ organisation: organisationId });
    return employees;
};

/**
 * Get employees By Id
 */
const getEmployeeById = async (id) => {
    const employees = await User.findById(id);
    return employees;
};

/**
 * Update employees
 */
const updateEmployee = async (organisationId, empId, body) => {
    const employees = await User.findOne({ _id: empId, organisation: organisationId });

    if (!employees) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found or does not belong to the organisation");
    }

    const organisation = await Organisation.findById(organisationId);

    if (body.email || body.empId) {
        const existingUser = await User.findOne({
            organisation: organisation.id,
            $or: [
                body.email ? { email: body.email } : null,
                body.empId ? { empId: body.empId } : null
            ].filter(Boolean), // Remove null values
            _id: { $ne: empId }
        });

        if (existingUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Email or Employee ID already exists in this organisation");
        }
    }

    const updateEmployee = await User.findByIdAndUpdate(empId, body, {
        new: true,
        runValidators: true,
    });

    return updateEmployee;
};

/**
 * Delete employees
 */
const deleteEmployee = async (organisationId, empId) => {
    const employees = await User.findOneAndDelete({
        _id: empId,
        organisation: organisationId,
    });

    if (!employees) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found or does not belong to the organisation");
    }

    return employees;
};

module.exports = {
    createEmployee,
    getEmployeeById,
    getEmployee,
    updateEmployee,
    deleteEmployee,
}