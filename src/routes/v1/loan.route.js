const express = require("express");
const loanController = require("../../controllers/loan.controller");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const loanValidation = require("../../validations/loan.validation");

const router = express.Router();

router.route("/").get(auth(), loanController.getLoansById);

router
  .route("/loan-request")
  .post(
    auth(),
    validate(loanValidation.requestLoan),
    loanController.requestLoans
  );

router.route("/allLoans").get(auth("getUsers"), loanController.getAllLoans);
router
  .route("/requested")
  .get(auth("getUsers"), loanController.getRequestedLoans);

router
  .route("/:userId")
  .get(
    auth("getUsers"),
    validate(loanValidation.getLoan),
    loanController.getLoansByUser
  );

router
  .route("/loan-approve/:loanId")
  .patch(
    auth("getUsers"),
    validate(loanValidation.approveLoan),
    loanController.approvedLoans
  );

router
  .route("/loan-pay/:loanId")
  .patch(auth(), validate(loanValidation.payLoan), loanController.payLoans);

module.exports = router;
