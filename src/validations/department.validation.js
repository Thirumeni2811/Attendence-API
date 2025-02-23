const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const departmentId = {
  params: Joi.object().keys({
    deptId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    departmentId,
}