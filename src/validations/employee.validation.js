const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const getEmployeeById = {
    params: Joi.object().keys({
        empId: Joi.string().custom(objectId),
    }),
};

const updateEmployee = {
    params: Joi.object().keys({
        empId: Joi.string().custom(objectId),
    }),
};

const deleteEmployee = {
    params: Joi.object().keys({
        empId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
}