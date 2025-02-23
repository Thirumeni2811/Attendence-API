const mongoose = require("mongoose");
const httpStatus = require("http-status");
const Loan = require("../models/loan.model");
const Setting = require("../models/setting.model");
const ApiError = require("../utils/ApiError");

/**
 * Loan Request - Get the amount
 */

const requestLoan = async (requestLoanBody, id) => {
  const { loanAmount } = requestLoanBody;

  // Check if the user already has a loan with status 'requested' or 'approved'
  const existingLoan = await Loan.findOne({
    userId: id,
    status: { $in: ["requested", "approved"] },
  });

  if (existingLoan) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You cannot request a new loan as you already have a loan in progress or approved."
    );
  }

  const settings = await Setting.findOne();
  if (!settings) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Settings not found. Please configure the processing charges, GST, and Interest"
    );
  }

  const { processingChargePerc, gst, interest, tenure, minAmount, maxAmount } =
    settings;

  // Validate loan amount
  if (loanAmount < minAmount || loanAmount > maxAmount) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Loan amount must be between ${minAmount} and ${maxAmount}`
    );
  }

  // Calculate the processing charge
  const processingFee = (loanAmount * processingChargePerc) / 100;

  // Calculate the GST
  const gstAmount = (processingFee * gst) / 100;

  // Calculate the total processing charge
  const totalProcessingCharge = processingFee + gstAmount;

  // Amount to be disbursed
  const amounts = loanAmount - totalProcessingCharge;

  // Annual interest over the tenure
  const annualInterestRate = interest;
  const monthlyInterestRate = annualInterestRate / 12;
  const totalInterestForTenure =
    (loanAmount * monthlyInterestRate * tenure) / 100;

  // Calculate the tenure installments
  const monthlyInstallment = loanAmount / tenure;
  const monthlyInterest = (loanAmount * interest) / 100 / 12;

  // Calculate the total amount
  const total = loanAmount + totalInterestForTenure;

  const tenures = [];
  // eslint-disable-next-line no-plusplus
  for (let month = 1; month <= tenure; month++) {
    const amount = monthlyInstallment + monthlyInterest;
    tenures.push({
      month,
      amount,
    });
  }

  const loanData = {
    // eslint-disable-next-line object-shorthand
    loanAmount: loanAmount,
    processingCharge: processingFee,
    gst: gstAmount,
    amountToBeDisburse: amounts,
    interestBeforeDueData: totalInterestForTenure,
    totalAmountPayable: total,
    status: "requested",
    tenure: tenures,
    userId: id,
    date: new Date(),
    time: new Date().toLocaleTimeString(),
  };

  return Loan.create(loanData);
};

/**
 * Approved the loans by loanId - Admin
 */
const approvedLoan = async (id) => {
  const loan = await Loan.findById(id);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Loan not found");
  }

  // check if the loan is already approved
  if (loan.status === "approved") {
    throw new ApiError(httpStatus.CONFLICT, "Loan is already approved");
  }

  // generate the ticket
  const loanTicket = () => {
    const date = new Date();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);

    // Format date as day/month/year-hour:minute:second:millisecond
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;

    return `${formattedDate}-${randomDigits}`;
  };

  // generate a unique ticket number for the loan
  const ticketNumber = loanTicket();

  // update the status to "approved"
  loan.status = "approved";

  // Set the loan ticket number for the loan
  loan.ticketNumber = ticketNumber;

  // update the tenure with the approval date and due status
  const approvalDate = new Date();
  loan.tenure = loan.tenure.map((tenure) => {
    // Set each tenure's date to the next month
    const dueDate = new Date(
      approvalDate.setMonth(approvalDate.getMonth() + 1)
    );

    // Create a unique loan ticket for each tenure
    // eslint-disable-next-line no-param-reassign
    tenure.loanTicket = loanTicket();

    // Update the tenure with the new due date and status
    // eslint-disable-next-line no-param-reassign
    tenure.date = dueDate;
    // eslint-disable-next-line no-param-reassign
    tenure.status = "due";
    // eslint-disable-next-line no-param-reassign
    tenure.loanTicket = loanTicket();
    return tenure;
  });

  await loan.save();
  return loan;
};

/**
 * Pay the loan by tenure based on payment details
 */
const payLoan = async (loanId, paymentDetails) => {
  const loan = await Loan.findById(loanId);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Loan not found");
  }

  const monthTenure = loan.tenure.id(paymentDetails._id);

  if (!monthTenure) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tenure not found");
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const tenureDate = new Date(monthTenure.date);
  tenureDate.setHours(0, 0, 0, 0);

  if (currentDate.getTime() !== tenureDate.getTime()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment is only allowed on the due date"
    );
  }

  // Validate if payment amount is sufficient for the tenure
  if (paymentDetails.amount < monthTenure.amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient payment amount");
  }

  // Check if the tenure is already paid or overdue
  if (monthTenure.status === "paid") {
    throw new ApiError(httpStatus.CONFLICT, "Tenure already paid");
  }

  // Update the tenure status to "paid"
  monthTenure.status = "paid";

  // Add payment history to the payments field of the loan
  loan.payments.push({
    amount: paymentDetails.amount,
    date: new Date(),
    tenureId: monthTenure._id,
    month: monthTenure.month,
    paidAmount: monthTenure.amount,
    dueDate: monthTenure.date,
  });

  // Check if all tenures are paid, and mark the loan as completed
  const allPaid = loan.tenure.every((t) => t.status === "paid");
  if (allPaid) {
    loan.status = "completed";
  }

  // Save the loan with updated tenure and status
  await loan.save();

  return loan;
};

/**
 * Get all loans - Admin
 */

const getAllLoan = async (filters = {}) => {
  const query = {};

  if (filters.userId) {
    query.userId = mongoose.Types.ObjectId(filters.userId);
  }

  if (filters.status) {
    query.status = { $regex: filters.status, $options: "i" };
  }
  const loans = await Loan.find(query).populate({
    path: "userId",
    select: "name profileImage",
    match: filters.name
      ? { name: { $regex: filters.name, $options: "i" } }
      : undefined,
  });

  const filteredLoans = loans.filter((loan) => loan.userId !== null);
  return filteredLoans;
};

/**
 * Get the Loan requested - Admin
 */

const getRequestedLoan = async (filters = {}) => {
  const query = { status: "requested" };

  if (filters.userId) {
    query.userId = mongoose.Types.ObjectId(filters.userId);
  }

  const loans = await Loan.find(query).populate({
    path: "userId",
    select: "name profileImage",
    match: filters.name
      ? { name: { $regex: filters.name, $options: "i" } }
      : undefined,
  });

  const filteredLoans = loans.filter((loan) => loan.userId !== null);

  return filteredLoans;
};

/**
 * Get the loan by token - User
 */
const getLoanById = async (id) => {
  // Retrieve loans by userId
  const loans = await Loan.find({ userId: id });

  loans.forEach((loan) => {
    loan.tenure.forEach((tenure) => {
      tenure.updateStatus();
    });
  });

  await Promise.all(loans.map((loan) => loan.save()));

  return loans;
};

/**
 * Get the loan by token - Admin
 */
const getLoanByUser = async (id) => {
  // Retrieve loans by userId
  const loans = await Loan.find({ userId: id });

  loans.forEach((loan) => {
    loan.tenure.forEach((tenure) => {
      tenure.updateStatus();
    });
  });

  await Promise.all(loans.map((loan) => loan.save()));

  return loans;
};

module.exports = {
  requestLoan,
  approvedLoan,
  getAllLoan,
  getRequestedLoan,
  getLoanById,
  payLoan,
  getLoanByUser,
};
