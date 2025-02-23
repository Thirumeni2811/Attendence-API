const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const scheduleId = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    scheduleId,
}