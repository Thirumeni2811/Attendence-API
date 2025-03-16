const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const scheduleId = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId),
  }),
};

const addBreak = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    breakType: Joi.string().valid("Short Break", "Lunch", "Other").required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().greater(Joi.ref("startTime")).required(),
    period: Joi.number().min(1).required(),
  }),
};

const updateBreak = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId).required(),
    breakId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    breakType: Joi.string().valid("Short Break", "Lunch", "Other").optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().greater(Joi.ref("startTime")).optional(),
    period: Joi.number().min(1).optional(),
  }),
};

const deleteBreak = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId).required(),
    breakId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  scheduleId,
  addBreak,
  updateBreak,
  deleteBreak,
}