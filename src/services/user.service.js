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
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filters = {}) => {
  // const users = await User.paginate(filter, options);
  const query = {};

  if (filters.userId) {
    query._id = filters.userId;
  }

  if (filters.name) {
    query.name = { $regex: filters.name, $options: "i" };
  }

  if (filters.phoneNo) {
    query.phoneNo = { $regex: filters.phoneNo, $options: "i" };
  }

  if (filters.aadharNo) {
    query.aadharNo = { $regex: filters.aadharNo, $options: "i" };
  }
  // console.log(query);
  const users = await User.find(query);

  return users;
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

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

// const createUsers = async (userData, role) => {
//   const user = new User({ ...userData, role });
//   return user.save();
// };

const createUsers = async (userData, role) => {
  // Check if email already exists
  const isEmailTaken = await User.isEmailTaken(userData.email);
  if (isEmailTaken) {
    throw new Error("Email is already taken");
  }

  // Check if userName already exists
  const userWithSameUserName = await User.findOne({
    userName: userData.userName,
  });
  if (userWithSameUserName) {
    throw new Error("Username is already taken");
  }

  const user = new User({ ...userData, role });
  return user.save();
};

const updateLocation = async (userId, location) => {
  return User.findByIdAndUpdate(
    userId,
    { currentLocation: location },
    { new: true }
  );
};

//------------------------------------------------------------------
/**
 * Get all users
 * @returns {Promise<User[]>}
 */
const getAllUsersForAdmin = async () => {
  return User.find();
};

/**
 * Get all salesPersonnel, with optional location filter
 * @param {string}
 * @returns {Promise<User[]>}
 */
const getAllWorkers = async () => {
  const query = { role: "subAdmin" };
  return User.find(query);
};

//------------------------------------------------------------------

/**
 * Query for users with optional filters: role, employeeId, name
 * @param {Object} queryParams - Filters for role, employeeId, name
 * @returns {Promise<User[]>}
 */
const getFilteredUsers = async (queryParams) => {
  const filter = {};

  if (queryParams.role) {
    filter.role = queryParams.role;
  }

  if (queryParams.employeeId) {
    // Partial match for employeeId (startsWith)
    filter.employeeId = { $regex: `^${queryParams.employeeId}`, $options: "i" };
  }

  if (queryParams.name) {
    // Partial match for name (case-insensitive)
    filter.name = { $regex: queryParams.name, $options: "i" };
  }

  const users = await User.find(filter);
  return users;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  createUsers,
  updateLocation,
  getUserByUsername,
  getAllUsersForAdmin,
  getAllWorkers,
  getFilteredUsers,
};
