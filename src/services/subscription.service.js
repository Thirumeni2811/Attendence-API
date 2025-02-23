const httpStatus = require("http-status");
// const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const razorpay = require("../config/paymentGateway"); // Assuming you have razorpay configured

/**
 * Create a new subscription plan and save it to the database
 * @param {Object} planData - Data to create the plan
 * @returns {Promise<Object>}
 */
const createPlan = async (planData) => {
  try {
    // Create plan on Razorpay
    const plan = await razorpay.plans.create(planData);
    return plan; // Return the created plan
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `An error occurred while creating the plan ${error}`
    );
  }
};

/**
 * Create a new subscription and save it to the database
 * @param {Object} subscriptionData - Data to create the subscription
 * @returns {Promise<Object>}
 */
const createSubscription = async (subscriptionData) => {
  try {
    // Extract customer details from subscription data
    const { name, email, contact, ...rest } = subscriptionData;

    // Create customer on Razorpay
    const customer = await razorpay.customers.create({
      name,
      email,
      contact,
    });

    // Prepare the subscription payload
    const subscriptionPayload = {
      ...rest,
      customer_id: customer.id, // Use the customer ID from the created customer
    };

    // Create subscription on Razorpay
    const subscription = await razorpay.subscriptions.create(
      subscriptionPayload
    );

    return subscription; // Return the created subscription
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `An error occurred while creating the subscription ${error}`
    );
  }
};

module.exports = {
  createPlan,
  createSubscription,
};
