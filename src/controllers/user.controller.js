const mongoose = require("mongoose");
const httpStatus = require("http-status");
// const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ["name", "role"]);
  // const options = pick(req.query, ["sortBy", "limit", "page"]);
  const filters = {
    userId:
      req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)
        ? mongoose.Types.ObjectId(req.query.userId)
        : undefined,
    name: req.query.name || undefined,
    phoneNo: req.query.phoneNo || undefined,
    aadharNo: req.query.aadharNo || undefined,
  };
  // console.log(filters);

  const result = await userService.queryUsers(filters);
  res.send({
    data: result,
  });
});

const fetchUser = catchAsync(async (req, res) => {
  const userId = req.user._id;
  // console.log(userId);
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserById(
    req.params.userId,
    req.body
  );
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Profile Updated successfully",
    user: updatedUser,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

//-------------------------------------------------------------------------------

/**
 * Get all Workers optionally filtered by allocatedLocation
 * @param {Request} req
 * @param {Response} res
 */
const getAllWorkers = catchAsync(async (req, res) => {
  const workers = await userService.getAllWorkers();
  res.status(httpStatus.OK).send({
    code: 200,
    message: "Workers data fetched successfully",
    workers,
  });
});

//-------------------------------------------------------------------------------

/**
 * Get all users with optional filters: role, employeeId, name
 * @param {Request} req
 * @param {Response} res
 */
const getAllUsers = catchAsync(async (req, res) => {
  const filters = {
    role: req.query.role,
    employeeId: req.query.employeeId,
    name: req.query.name,
  };

  const users = await userService.getFilteredUsers(filters);

  res.status(httpStatus.OK).send({
    code: 200,
    message: "Users fetched successfully",
    users,
  });
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  fetchUser,
  updateUser,
  deleteUser,
  getAllWorkers,
  getAllUsers,
};
