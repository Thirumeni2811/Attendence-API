const Joi = require("joi");

const actionSchema = Joi.object({
  action: Joi.string().valid("check-in", "check-out").required(),
  date: Joi.date().iso().required(), // Ensures date is in ISO 8601 format
  location: Joi.object({
    latitude: Joi.string().pattern(/^-?\d+\.\d+$/).required(), // Latitude as a string with decimal points
    longitude: Joi.string().pattern(/^-?\d+\.\d+$/).required(), // Longitude as a string with decimal points
    address: Joi.string().max(255).required() // Address as a string with a max length
  }).required()
});

module.exports = {
  actionSchema
};
