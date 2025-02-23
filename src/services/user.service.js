const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return User.create(userBody);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by username
 * @param {string} userName
 * @returns {Promise<User>}
 */
const getUserByUsername = async (userName) => {
  return User.findOne({ userName });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  if (updateBody.email) {
    // Check if the email is already taken
    const emailTaken = await User.findOne({
      email: updateBody.email,
      _id: { $ne: userId },
    });
    if (emailTaken) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
  }

  // Only hash password if it's being updated
  if (updateBody.password) {
    // eslint-disable-next-line no-param-reassign
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }

  // Update user in the database
  const user = await User.findByIdAndUpdate(userId, updateBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

//------------------------------------------------------------------

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  getUserByUsername,
};