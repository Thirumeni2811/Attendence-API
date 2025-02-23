const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const User = require("../models/user.model");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Login with phoneNo
 * @param {string} phoneNo
 */

const loginWithPhoneNo = async (phoneNo, success, res) => {
  // console.log('Attempting login with phone number:', phoneNo);

  if (success) {
    let user = await User.findOne({ phoneNo });
    if (!user) {
      user = await User.create({ phoneNo });
    }

    user.isPhoneNoVerified = true;
    await user.save();

    return user;
  }
  return res
    .status(httpStatus.BAD_REQUEST)
    .json({ message: "Please verify your OTP." });
};

/**
 * Aadhar verification
 */

const verifyAadhar = async (aadharBody, res) => {
  const { userId, aadharPhotos, aadharNo, success } = aadharBody;

  if (success) {
    const user = await User.findById(userId);

    // If the user already has an Aadhar number, don't allow updates
    if (user.aadharNo) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Aadhar number is already linked. You cannot update it.",
      });
    }

    // Check if the Aadhar number is already associated with another user
    const existingUserWithAadhar = await User.findOne({ aadharNo });
    if (
      existingUserWithAadhar &&
      existingUserWithAadhar._id.toString() !== userId
    ) {
      return res.status(httpStatus.CONFLICT).json({
        message: "This Aadhar number is already linked to another user",
      });
    }

    const updateAadharDetails = await User.findByIdAndUpdate(userId, {
      $set: {
        aadharNo,
        "aadharPhotos.frontPhoto": aadharPhotos.frontPhoto,
        "aadharPhotos.backPhoto": aadharPhotos.backPhoto,
      },
    });
    updateAadharDetails.isAadharNoVerified = true;
    await updateAadharDetails.save();
    return updateAadharDetails;
  }
  return res
    .status(httpStatus.BAD_REQUEST)
    .json({ message: "Please verify your Aadhar" });
};

/**
 * Pan verification
 */
const verifyPan = async (panBody, res) => {
  const { userId, panPhotos, panNo } = panBody;

  const user = await User.findById(userId);

  // If the user already has an pan number, don't allow updates
  if (user.panNo) {
    return res.status(httpStatus.CONFLICT).json({
      message: "Pan number is already linked. You cannot updated it.",
    });
  }

  // Check if the pan number is already associated with another user
  const existingUserWithPan = await User.findOne({ panNo });
  if (existingUserWithPan && existingUserWithPan._id.toString() !== userId) {
    return res
      .status(httpStatus.CONFLICT)
      .json({ message: "This Pan number is already linked to another user" });
  }

  const updatePanDetails = await User.findByIdAndUpdate(userId, {
    $set: {
      panNo,
      "panPhotos.frontPhoto": panPhotos.frontPhoto,
      "panPhotos.backPhoto": panPhotos.backPhoto,
    },
  });
  updatePanDetails.isPanNoVerified = true;
  await updatePanDetails.save();
  return updatePanDetails;
};

/**
 * Login with username and password
 * @param {string} userName
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUsernameAndPassword = async (userName, password) => {
  const user = await userService.getUserByUsername(userName);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect username or password"
    );
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------

module.exports = {
  loginUserWithEmailAndPassword,
  loginWithPhoneNo,
  verifyAadhar,
  verifyPan,
  loginUserWithUsernameAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
