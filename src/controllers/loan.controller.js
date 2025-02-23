const httpStatus = require("http-status");
const { loanService } = require("../services");
const catchAsync = require("../utils/catchAsync");

/**
 * Loan request
 */
const requestLoans = catchAsync(async (req, res) => {
  const { loanAmount } = req.body;
  const loan = await loanService.requestLoan({ loanAmount }, req.user._id);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: "Loan request successfully sent",
    data: loan,
  });
});

/**
 * Approved the Loans by userId - Admin
 */
const approvedLoans = catchAsync(async (req, res) => {
  const loan = await loanService.approvedLoan(req.params.loanId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Loan has been approved successfully",
    loan,
  });
});

/**
 * get all loans - admin
 */
const getAllLoans = catchAsync(async (req, res) => {
  const filters = {
    userId: req.query.userId || undefined, // Get from query parameters
    status: req.query.status || undefined, // Get from query parameters
  };
  const loans = await loanService.getAllLoan(filters);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    data: loans,
  });
});

/**
 * Get the Loan requested - Admin
 */

const getRequestedLoans = catchAsync(async (req, res) => {
  const filters = {
    userId: req.query.userId || undefined,
    name: req.query.name || undefined,
  };
  const loans = await loanService.getRequestedLoan(filters);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    data: loans,
  });
});

/**
 * fetch the loan - user
 */
const getLoansById = catchAsync(async (req, res) => {
  const loans = await loanService.getLoanById(req.user._id);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    data: loans,
  });
});

/**
 * fetch the loan - Admin
 */
const getLoansByUser = catchAsync(async (req, res) => {
  const loans = await loanService.getLoanByUser(req.params.userId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    data: loans,
  });
});

/**
 * pay the loan by tenure based
 */
const payLoans = catchAsync(async (req, res) => {
  const loan = await loanService.payLoan(req.params.loanId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Payment successfully",
    loan,
  });
});

module.exports = {
  requestLoans,
  approvedLoans,
  getAllLoans,
  getRequestedLoans,
  getLoansById,
  payLoans,
  getLoansByUser,
};
