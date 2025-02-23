const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const holidayId = {
  params: Joi.object().keys({
    holidayId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    holidayId,
}