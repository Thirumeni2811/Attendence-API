const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const loginUserWithPhoneNo = catchAsync(async (req, res) => {
  const { phoneNo, success } = req.body;
  const user = await authService.loginWithPhoneNo(phoneNo, success, res);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Phone number verified successfully",
    user,
    tokens,
  });
});

const aadharVerifications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { aadharPhotos, aadharNo, success } = req.body;
  const aadhar = await authService.verifyAadhar(
    { userId, aadharPhotos, aadharNo, success },
    res
  );
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Aadhar verified successfully",
    aadhar,
  });
});

const panVerifications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { panPhotos, panNo } = req.body;
  const aadhar = await authService.verifyPan({ userId, panPhotos, panNo }, res);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "PAN verified successfully",
    aadhar,
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const createWorkers = catchAsync(async (req, res) => {
  try {
    const workers = await userService.createUsers(req.body, "subAdmin");
    res.status(httpStatus.CREATED).send({
      code: 201,
      message: "Sub-Admin created",
      workers,
    });
  } catch (error) {
    // Handle specific error messages
    const errorMessage = error.message;

    if (errorMessage === "Email is already taken") {
      return res.status(httpStatus.BAD_REQUEST).send({
        code: 400,
        message: errorMessage,
      });
    }

    if (errorMessage === "Username is already taken") {
      return res.status(httpStatus.BAD_REQUEST).send({
        code: 400,
        message: errorMessage,
      });
    }

    // For other unexpected errors, send a general error response
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: 500,
      message: "An error occurred while creating workers",
    });
  }
});

const updateCurrentLocation = catchAsync(async (req, res) => {
  const salesPersonnel = await userService.updateLocation(
    req.params.userId,
    req.body.currentLocation
  );
  res
    .status(httpStatus.OK)
    .send({ code: 200, message: "Location updated", salesPersonnel });
});

const loginUsers = catchAsync(async (req, res) => {
  const { userName, password } = req.body;
  const Users = await authService.loginUserWithUsernameAndPassword(
    userName,
    password
  );

  // // Check if the user's role is 'Users'
  // if (Users.role !== "dentalAssistant" || Users.role !== "workers") {
  //   throw new ApiError(
  //     httpStatus.FORBIDDEN,
  //     "Access restricted to Authorized persons only"
  //   );
  // }

  const tokens = await tokenService.generateAuthTokens(Users);
  res.send({
    code: 200,
    message: "Users logged in successfully",
    Users,
    tokens,
  });
});

const loginSalesPersonnel = catchAsync(async (req, res) => {
  const { userName, password } = req.body;
  const salesPersonnel = await authService.loginUserWithUsernameAndPassword(
    userName,
    password
  );

  // Check if the user's role is 'salesPersonnel'
  if (salesPersonnel.role !== "salesPersonnel") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Access restricted to Sales Personnel only"
    );
  }

  const tokens = await tokenService.generateAuthTokens(salesPersonnel);
  res.send({
    code: 200,
    message: "SalesPersonnel logged in successfully",
    salesPersonnel,
    tokens,
  });
});

//---------------------------------------------------------------------------------------
module.exports = {
  register,
  login,
  loginUserWithPhoneNo,
  aadharVerifications,
  panVerifications,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  loginUsers,
  createWorkers,
  loginSalesPersonnel,
  updateCurrentLocation,
};
