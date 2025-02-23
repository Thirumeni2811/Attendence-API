const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const locationId = {
  params: Joi.object().keys({
    locId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    locationId,
}