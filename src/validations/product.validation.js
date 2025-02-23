const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createProduct = {
  body: Joi.object().keys({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    exTaxPrice: Joi.number().required(),
    category: Joi.string().custom(objectId).required(), // Assume category is passed as an ObjectId string
    hint: Joi.string().optional(),
    comboProducts: Joi.array().items(Joi.string().custom(objectId)).optional(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    category: Joi.string().custom(objectId).optional(), // Optional category filter
  }),
};

const getProductById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    productName: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    exTaxPrice: Joi.number().optional(),
    category: Joi.string().custom(objectId).optional(),
    hint: Joi.string().optional(),
    comboProducts: Joi.array().items(Joi.string().custom(objectId)).optional(),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

const searchProducts = {
  query: Joi.object().keys({
    q: Joi.string().required(), // The search term
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
