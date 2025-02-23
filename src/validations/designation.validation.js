const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const designationId = {
  params: Joi.object().keys({
    desgId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    designationId,
}