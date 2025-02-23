const Joi = require("joi");
const { objectId } = require("./custom.validation");

const requestLoan = {
  body: Joi.object().keys({
    loanAmount: Joi.number().required(),
  }),
};

const approveLoan = {
  params: Joi.object().keys({
    loanId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid("approved").required(),
  }),
};

const getLoan = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const payLoan = {
  params: Joi.object().keys({
    loanId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    _id: Joi.string().custom(objectId).required(),
    month: Joi.number().positive().required(),
    amount: Joi.number().positive().required(),
    date: Joi.date().required(),
    loanTicket: Joi.string().required(),
  }),
};

module.exports = {
  requestLoan,
  approveLoan,
  payLoan,
  getLoan,
};
