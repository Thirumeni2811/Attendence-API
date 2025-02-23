const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      profileImage: Joi.string().required().trim(),
      name: Joi.string().required().trim(),
      address: Joi.string().required().trim(),
      email: Joi.string().email().required().trim(),
      contactNo: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .trim(),
      accountInformation: Joi.object()
        .keys({
          bankName: Joi.string().required().trim(),
          accountNo: Joi.string().required().trim(),
          ifsc: Joi.string().required().trim(),
        })
        .required(),
    })
    .required(),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
