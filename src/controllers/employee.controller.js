const httpStatus = require("http-status");
const { employeeService } = require("../services");
const catchAsync = require("../utils/catchAsync");

//create employee
const createEmployees = catchAsync(async (req, res) => {
    const employee = await employeeService.createEmployee(req.user.organisation, req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Employee created successfully",
        data: employee,
    });
});

// Get employee
const getEmployees = catchAsync(async (req, res) => {
    const data = await employeeService.getEmployee(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

// Get employee By token
const getEmployeesByToken = catchAsync(async (req, res) => {
    const data = await employeeService.getEmployeeById(req.user._id);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

// Get employee By token
const getEmployeesById = catchAsync(async (req, res) => {
    const data = await employeeService.getEmployeeById(req.params.empId);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

// Update employee
const updateEmployees = catchAsync(async (req, res) => {
    const data = await employeeService.updateEmployee(req.user.organisation, req.params.empId, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Department updated successfully",
        data,
    });
});

// Delete employee
const deleteEmployees = catchAsync(async (req, res) => {
    await employeeService.deleteEmployee(req.user.organisation, req.params.empId, req.body);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createEmployees,
    getEmployees,
    getEmployeesByToken,
    getEmployeesById,
    updateEmployees,
    deleteEmployees,
}