const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { departmentService } = require("../services");

// Create departments
const createDepartments = catchAsync(async (req, res) => {
    const data = await departmentService.createDepartment(req.user.organisation, req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Department created successfully",
        data,
    });
});

// Get departments
const getDepartments = catchAsync(async (req, res) => {
    const data = await departmentService.getDepartmentById(req.user.organisation);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        data,
    });
});

// Update departments
const updateDepartments = catchAsync(async (req, res) => {
    const data = await departmentService.updateDepartment(req.user.organisation, req.params.deptId, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Department updated successfully",
        data,
    });
});

// Delete departments
const deleteDepartments = catchAsync(async (req, res) => {
    await departmentService.deleteDepartment(req.user.organisation, req.params.deptId, req.body);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createDepartments,
    getDepartments,
    updateDepartments,
    deleteDepartments
};
