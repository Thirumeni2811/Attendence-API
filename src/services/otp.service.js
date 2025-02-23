const httpStatus = require("http-status");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const sendOtp = async (req, res) => {
  const { phoneNo } = req.body;

  if (!phoneNo) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number is required");
  }

  // Validate the phone number - Indian
  const isValidPhoneNo = /^(?:\+91|0)?[6-9]\d{9}$/.test(phoneNo);
  if (!isValidPhoneNo) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Invalid Indian phone number format" });
  }

  try {
    let user = await User.findOne({ phoneNo });

    if (!user) {
      user = await User.create({ phoneNo });
    }
    return res.status(httpStatus.OK).send({
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNo, success } = req.body;

  if (!phoneNo || success === undefined) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Phone number and success flag are required",
    });
  }

  // Validate the phone number - Indian
  const isValidPhoneNo = /^(?:\+91|0)?[6-9]\d{9}$/.test(phoneNo);
  if (!isValidPhoneNo) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Invalid Indian phone number format" });
  }

  try {
    if (success) {
      await User.updateOne({ phoneNo }, { $set: { isPhoneNoVerified: true } });
      return res.status(httpStatus.OK).send({
        message: "Successfully verified",
      });
    }
    // Removed unnecessary else statement
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Please try again",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
