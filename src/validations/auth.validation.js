const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).messages({
      "string.min": "Password must be at least 8 characters long",
    }),
    role: Joi.string().required().valid("creator", "admin", "subAdmin", "user"),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const loginWithPhoneNo = {
  body: Joi.object().keys({
    phoneNo: Joi.string()
      .required()
      .pattern(/^\d{10}$/),
    success: Joi.boolean().required(),
  }),
};

const aadharVerification = {
  body: Joi.object().keys({
    aadharNo: Joi.string()
      .required()
      .pattern(/^\d{12}$/), // Aadhar number with exactly 12 digits
    aadharPhotos: Joi.object().keys({
      frontPhoto: Joi.string().required(),
      backPhoto: Joi.string().required(),
    }),
    success: Joi.boolean().required(),
  }),
};

const panVerification = {
  body: Joi.object().keys({
    panNo: Joi.string()
      .required()
      .pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/), // PAN number format: 5 letters, 4 digits, 1 letter
    panPhotos: Joi.object().keys({
      frontPhoto: Joi.string().required(),
      backPhoto: Joi.string().required(),
    }),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  loginWithPhoneNo,
  aadharVerification,
  panVerification,
};
