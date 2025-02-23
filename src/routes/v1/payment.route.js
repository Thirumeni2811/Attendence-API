const express = require("express");
const subscriptionController = require("../../controllers/subscription.controller");

const router = express.Router();
router.route("/create-plan").post(subscriptionController.createPlanController);
router
  .route("/create-subscribe")
  .post(subscriptionController.createSubscriptionController);

module.exports = router;
