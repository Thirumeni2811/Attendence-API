/* eslint-disable camelcase */

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  createPlan,
  createSubscription,
} = require("../services/subscription.service");

// CREATE PLAN CONTROLLER
const createPlanController = catchAsync(async (req, res) => {
  const { period, interval, item, notes } = req.body;
  const planData = { period, interval, item, notes };

  try {
    const newPlan = await createPlan(planData);
    res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
});

// CREATE SUBSCRIPTION CONTROLLER
const createSubscriptionController = catchAsync(async (req, res) => {
  // Receive subscription details from request body
  const {
    name,
    email,
    contact,
    plan_id,
    total_count,
    quantity,
    customer_notify,
    start_at,
    expire_by,
    addons,
    offer_id,
    notes,
  } = req.body;

  const subscriptionData = {
    name,
    email,
    contact,
    plan_id,
    total_count,
    quantity,
    customer_notify,
    start_at,
    expire_by,
    addons,
    offer_id,
    notes,
  };

  try {
    // Create the subscription using the service
    const newSubscription = await createSubscription(subscriptionData);
    res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      message: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
});

module.exports = {
  createPlanController,
  createSubscriptionController,
};
