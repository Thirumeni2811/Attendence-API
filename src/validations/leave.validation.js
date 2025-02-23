const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const leaveId = {
  params: Joi.object().keys({
    leaveId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    leaveId,
}