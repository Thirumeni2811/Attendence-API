const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const getOrganisation = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
    getOrganisation,
}